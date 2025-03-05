'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import socketService from '../services/socketService';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState({
    status: 'waiting', // waiting, playing, finished
    round: 0,
    isPlayerTurn: false,
  });
  
  const [playerData, setPlayerData] = useState({
    id: null,
    name: '',
    cards: [],
    selectedCard: null,
    playedCard: null,
    stats: { hp: 20, wins: 0 },
  });
  
  const [opponentData, setOpponentData] = useState({
    id: null,
    name: '',
    playedCard: null,
    stats: { hp: 20, wins: 0 },
  });
  
  const [battleResult, setBattleResult] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Setup socket event listeners
    const setupSocketListeners = () => {
      socketService.on('gameJoined', handleGameJoined);
      socketService.on('gameStarted', handleGameStarted);
      socketService.on('gameUpdate', handleGameUpdate);
      socketService.on('gameTurn', handleGameTurn);
      socketService.on('gameBattle', handleGameBattle);
      socketService.on('gameOver', handleGameOver);
      socketService.on('playerDisconnected', handlePlayerDisconnected);
      socketService.on('roomsUpdate', handleRoomsUpdate);
    };

    // Connect to socket server
    const connectToServer = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);
        setupSocketListeners();
        
        // Get initial rooms list
        socketService.getRooms((roomsList) => {
          setRooms(roomsList);
        });
      } catch (error) {
        console.error('Failed to connect to game server:', error);
        setIsConnected(false);
      }
    };

    connectToServer();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Room-related functions
  const createRoom = async (roomName, playerName) => {
    if (!isConnected) return;
    
    try {
      const response = await socketService.createRoom(roomName, playerName);
      setPlayerData(prev => ({
        ...prev,
        id: response.playerId,
        name: playerName,
      }));
      return response;
    } catch (error) {
      console.error('Failed to create room:', error);
      return { error };
    }
  };

  const joinRoom = async (roomId, playerName) => {
    if (!isConnected) return;
    
    try {
      const response = await socketService.joinRoom(roomId, playerName);
      setPlayerData(prev => ({
        ...prev,
        id: response.playerId,
        name: playerName,
      }));
      return response;
    } catch (error) {
      console.error('Failed to join room:', error);
      return { error };
    }
  };

  const handleRoomsUpdate = (updatedRooms) => {
    setRooms(updatedRooms);
  };

  // Game-related functions
  const joinGame = async (playerName) => {
    if (!isConnected) return;
    
    try {
      const response = await socketService.joinGame(playerName);
      setPlayerData(prev => ({
        ...prev,
        id: response.playerId,
        name: playerName,
      }));
      return response;
    } catch (error) {
      console.error('Failed to join game:', error);
      return { error };
    }
  };

  const selectCard = (card) => {
    if (!gameState.isPlayerTurn) return;
    
    setPlayerData(prev => ({
      ...prev,
      selectedCard: card.id,
    }));
  };

  const playCard = () => {
    if (!gameState.isPlayerTurn || !playerData.selectedCard) return;
    
    const selectedCard = playerData.cards.find(card => card.id === playerData.selectedCard);
    
    socketService.playCard(playerData.selectedCard);
    
    setPlayerData(prev => ({
      ...prev,
      playedCard: selectedCard,
      selectedCard: null,
    }));
    
    setGameState(prev => ({
      ...prev,
      isPlayerTurn: false,
    }));
  };

  // Socket event handlers
  const handleGameJoined = (data) => {
    setPlayerData(prev => ({
      ...prev,
      cards: data.cards,
    }));
  };

  const handleGameStarted = (data) => {
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      round: 1,
      isPlayerTurn: data.isPlayerTurn,
    }));
    
    setOpponentData(prev => ({
      ...prev,
      id: data.opponentId,
      name: data.opponentName,
    }));
    
    if (data.cards) {
      setPlayerData(prev => ({
        ...prev,
        cards: data.cards,
      }));
    }
  };

  const handleGameUpdate = (data) => {
    if (data.playerCards) {
      setPlayerData(prev => ({
        ...prev,
        cards: data.playerCards,
      }));
    }
    
    if (data.playerStats) {
      setPlayerData(prev => ({
        ...prev,
        stats: data.playerStats,
      }));
    }
    
    if (data.opponentStats) {
      setOpponentData(prev => ({
        ...prev,
        stats: data.opponentStats,
      }));
    }
  };

  const handleGameTurn = (data) => {
    setGameState(prev => ({
      ...prev,
      round: data.round,
      isPlayerTurn: data.isPlayerTurn,
    }));
    
    // Reset played cards
    setPlayerData(prev => ({
      ...prev,
      playedCard: null,
    }));
    
    setOpponentData(prev => ({
      ...prev,
      playedCard: null,
    }));
    
    setBattleResult(null);
  };

  const handleGameBattle = (data) => {
    setOpponentData(prev => ({
      ...prev,
      playedCard: data.opponentCard,
    }));
    
    setBattleResult(data.result);
  };

  const handleGameOver = (data) => {
    setGameState(prev => ({
      ...prev,
      status: 'finished',
    }));
  };

  const handlePlayerDisconnected = () => {
    setGameState(prev => ({
      ...prev,
      status: 'waiting',
    }));
    
    setOpponentData({
      id: null,
      name: '',
      playedCard: null,
      stats: { hp: 20, wins: 0 },
    });
  };

  const resetGame = () => {
    setGameState({
      status: 'waiting',
      round: 0,
      isPlayerTurn: false,
    });
    
    setPlayerData(prev => ({
      ...prev,
      cards: [],
      selectedCard: null,
      playedCard: null,
      stats: { hp: 20, wins: 0 },
    }));
    
    setOpponentData({
      id: null,
      name: '',
      playedCard: null,
      stats: { hp: 20, wins: 0 },
    });
    
    setBattleResult(null);
  };

  return (
    <GameContext.Provider
      value={{
        isConnected,
        gameState,
        playerData,
        opponentData,
        battleResult,
        rooms,
        joinGame,
        selectCard,
        playCard,
        resetGame,
        createRoom,
        joinRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 