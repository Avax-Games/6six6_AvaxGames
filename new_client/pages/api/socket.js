import { Server } from 'socket.io';
import { generateDeck, calculateBattleResult } from '../../utils/gameLogic';

// API route configuration
export const config = {
  api: {
    bodyParser: false,
  },
};

// Game state (kept outside the handler to persist between API calls)
const players = new Map();
const games = new Map();
const rooms = new Map();
const waitingPlayers = [];

export default function SocketHandler(req, res) {
  // Check if socket server is already running
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Setting up socket');
  
  // Create a new Socket.IO server instance
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  
  // Store the io instance on the server object
  res.socket.server.io = io;

  // Socket connection
  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Room-related events
    socket.on('rooms:get', (data, callback) => {
      const roomsList = Array.from(rooms.values()).map(room => ({
        id: room.id,
        name: room.name,
        players: room.players.map(playerId => {
          const player = players.get(playerId);
          return {
            id: playerId,
            name: player ? player.name : 'Unknown',
          };
        }),
      }));
      
      callback(roomsList);
    });

    socket.on('room:create', (data, callback) => {
      const { roomName, playerName } = data;
      const roomId = `room_${Date.now()}`;
      
      // Create player
      const player = {
        id: socket.id,
        name: playerName,
        socket,
        roomId,
        gameId: null,
        cards: [],
        stats: { hp: 20, wins: 0 },
      };
      
      players.set(socket.id, player);
      
      // Create room
      const room = {
        id: roomId,
        name: roomName,
        players: [socket.id],
        gameId: null,
      };
      
      rooms.set(roomId, room);
      
      // Join socket room
      socket.join(roomId);
      
      // Broadcast updated rooms list
      broadcastRooms();
      
      callback({ 
        success: true, 
        roomId,
        playerId: socket.id,
      });
    });

    socket.on('room:join', (data, callback) => {
      const { roomId, playerName } = data;
      const room = rooms.get(roomId);
      
      if (!room) {
        callback({ success: false, error: 'Room not found' });
        return;
      }
      
      if (room.players.length >= 2) {
        callback({ success: false, error: 'Room is full' });
        return;
      }
      
      // Create player
      const player = {
        id: socket.id,
        name: playerName,
        socket,
        roomId,
        gameId: null,
        cards: [],
        stats: { hp: 20, wins: 0 },
      };
      
      players.set(socket.id, player);
      
      // Add player to room
      room.players.push(socket.id);
      
      // Join socket room
      socket.join(roomId);
      
      // Broadcast updated rooms list
      broadcastRooms();
      
      // If room is now full, start a game
      if (room.players.length === 2) {
        const [player1Id, player2Id] = room.players;
        const gameId = createGame(player1Id, player2Id);
        room.gameId = gameId;
      }
      
      callback({ 
        success: true, 
        roomId,
        playerId: socket.id,
      });
    });

    // Join game
    socket.on('game:join', async (data, callback) => {
      const { playerName } = data;
      const playerId = socket.id;
      
      // Create player
      const player = {
        id: playerId,
        name: playerName,
        cards: generateDeck(5), // Generate 5 random cards
        socket,
        gameId: null,
        stats: { hp: 20, wins: 0 },
      };
      
      players.set(playerId, player);
      
      // Notify player they've joined
      callback({ 
        success: true, 
        playerId,
        cards: player.cards,
      });
      
      socket.emit('game:joined', { cards: player.cards });
      
      // Check for waiting players
      if (waitingPlayers.length > 0) {
        const opponentId = waitingPlayers.shift();
        const opponent = players.get(opponentId);
        
        if (opponent) {
          // Create a new game
          createGame(playerId, opponentId);
        } else {
          // If opponent is no longer available, add to waiting list
          waitingPlayers.push(playerId);
        }
      } else {
        // Add to waiting list
        waitingPlayers.push(playerId);
      }
    });

    // Play card
    socket.on('game:play-card', (data) => {
      const { cardId } = data;
      const playerId = socket.id;
      const player = players.get(playerId);
      
      if (!player || !player.gameId) return;
      
      const game = games.get(player.gameId);
      if (!game) return;
      
      // Check if it's player's turn
      if (game.currentTurn !== playerId) return;
      
      // Find the card
      const cardIndex = player.cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return;
      
      const card = player.cards[cardIndex];
      
      // Remove card from player's hand
      player.cards.splice(cardIndex, 1);
      
      // Set played card
      game.playedCards[playerId] = card;
      
      // Check if both players have played a card
      const opponentId = game.players.find(id => id !== playerId);
      
      if (game.playedCards[opponentId]) {
        // Both players have played a card, resolve battle
        resolveBattle(game);
      } else {
        // Switch turn to opponent
        game.currentTurn = opponentId;
        
        // Notify opponent it's their turn
        const opponent = players.get(opponentId);
        if (opponent) {
          opponent.socket.emit('game:turn', {
            round: game.round,
            isPlayerTurn: true,
          });
        }
        
        // Notify current player it's not their turn anymore
        socket.emit('game:turn', {
          round: game.round,
          isPlayerTurn: false,
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      const playerId = socket.id;
      const player = players.get(playerId);
      
      if (player) {
        // Remove from waiting list if present
        const waitingIndex = waitingPlayers.indexOf(playerId);
        if (waitingIndex !== -1) {
          waitingPlayers.splice(waitingIndex, 1);
        }
        
        // Handle room cleanup
        if (player.roomId) {
          const room = rooms.get(player.roomId);
          if (room) {
            // Remove player from room
            room.players = room.players.filter(id => id !== playerId);
            
            // If room is empty, remove it
            if (room.players.length === 0) {
              rooms.delete(player.roomId);
            } else {
              // Notify other players in the room
              socket.to(player.roomId).emit('player:left', { playerId });
            }
            
            // Broadcast updated rooms list
            broadcastRooms();
          }
        }
        
        // Handle game cleanup
        if (player.gameId) {
          const game = games.get(player.gameId);
          if (game) {
            // Notify opponent
            const opponentId = game.players.find(id => id !== playerId);
            const opponent = players.get(opponentId);
            
            if (opponent) {
              opponent.gameId = null;
              opponent.socket.emit('player:disconnected');
            }
            
            // Remove game
            games.delete(player.gameId);
          }
        }
        
        // Remove player
        players.delete(playerId);
      }
      
      console.log(`Player disconnected: ${playerId}`);
      
      // Broadcast updated rooms list
      broadcastRooms();
    });
  });

  // Broadcast updated rooms list to all clients
  function broadcastRooms() {
    const roomsList = Array.from(rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      players: room.players.map(playerId => {
        const player = players.get(playerId);
        return {
          id: playerId,
          name: player ? player.name : 'Unknown',
        };
      }),
    }));
    
    io.emit('rooms:update', roomsList);
  }

  // Create a new game between two players
  function createGame(player1Id, player2Id) {
    const gameId = `game_${Date.now()}`;
    
    const game = {
      id: gameId,
      players: [player1Id, player2Id],
      round: 1,
      currentTurn: player1Id, // Player 1 goes first
      playedCards: {},
      status: 'playing',
    };
    
    games.set(gameId, game);
    
    // Update players with game ID
    const player1 = players.get(player1Id);
    const player2 = players.get(player2Id);
    
    // Generate cards for players
    player1.cards = generateDeck(5);
    player2.cards = generateDeck(5);
    
    player1.gameId = gameId;
    player2.gameId = gameId;
    
    // Notify players that game has started
    player1.socket.emit('game:started', {
      opponentId: player2Id,
      opponentName: player2.name,
      isPlayerTurn: true,
      cards: player1.cards,
    });
    
    player2.socket.emit('game:started', {
      opponentId: player1Id,
      opponentName: player1.name,
      isPlayerTurn: false,
      cards: player2.cards,
    });
    
    console.log(`Game created: ${gameId} between ${player1.name} and ${player2.name}`);
    
    return gameId;
  }

  // Resolve battle between two cards
  function resolveBattle(game) {
    const [player1Id, player2Id] = game.players;
    const player1 = players.get(player1Id);
    const player2 = players.get(player2Id);
    
    const player1Card = game.playedCards[player1Id];
    const player2Card = game.playedCards[player2Id];
    
    // Calculate battle result
    const result = calculateBattleResult(player1Card, player2Card);
    
    // Update player stats based on result
    if (result.winner === 'player1') {
      player2.stats.hp -= result.damage;
      if (player2.stats.hp <= 0) {
        player1.stats.wins += 1;
        player2.stats.hp = 20; // Reset HP
      }
    } else if (result.winner === 'player2') {
      player1.stats.hp -= result.damage;
      if (player1.stats.hp <= 0) {
        player2.stats.wins += 1;
        player1.stats.hp = 20; // Reset HP
      }
    }
    
    // Send battle result to players
    player1.socket.emit('game:battle', {
      opponentCard: player2Card,
      result: {
        winner: result.winner === 'player1' ? 'player' : result.winner === 'player2' ? 'opponent' : 'draw',
        damage: result.damage,
        description: result.description,
      },
    });
    
    player2.socket.emit('game:battle', {
      opponentCard: player1Card,
      result: {
        winner: result.winner === 'player2' ? 'player' : result.winner === 'player1' ? 'opponent' : 'draw',
        damage: result.damage,
        description: result.description,
      },
    });
    
    // Update game state
    game.round += 1;
    game.playedCards = {};
    
    // Check if game is over (a player has won 3 rounds)
    if (player1.stats.wins >= 3 || player2.stats.wins >= 3) {
      game.status = 'finished';
      
      player1.socket.emit('game:over', {
        winner: player1.stats.wins >= 3 ? 'player' : 'opponent',
      });
      
      player2.socket.emit('game:over', {
        winner: player2.stats.wins >= 3 ? 'player' : 'opponent',
      });
      
      // Reset game
      player1.gameId = null;
      player2.gameId = null;
      games.delete(game.id);
    } else {
      // Deal new cards if needed
      if (player1.cards.length < 3) {
        const newCards = generateDeck(2);
        player1.cards = [...player1.cards, ...newCards];
        player1.socket.emit('game:update', { playerCards: player1.cards });
      }
      
      if (player2.cards.length < 3) {
        const newCards = generateDeck(2);
        player2.cards = [...player2.cards, ...newCards];
        player2.socket.emit('game:update', { playerCards: player2.cards });
      }
      
      // Update player stats
      player1.socket.emit('game:update', {
        playerStats: player1.stats,
        opponentStats: player2.stats,
      });
      
      player2.socket.emit('game:update', {
        playerStats: player2.stats,
        opponentStats: player1.stats,
      });
      
      // Start next round
      const nextTurn = Math.random() < 0.5 ? player1Id : player2Id;
      game.currentTurn = nextTurn;
      
      player1.socket.emit('game:turn', {
        round: game.round,
        isPlayerTurn: nextTurn === player1Id,
      });
      
      player2.socket.emit('game:turn', {
        round: game.round,
        isPlayerTurn: nextTurn === player2Id,
      });
    }
  }

  res.end();
} 