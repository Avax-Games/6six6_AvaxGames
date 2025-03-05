import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.gameCallbacks = {};
  }

  async connect() {
    if (this.socket) {
      return Promise.resolve(this.socket.id);
    }

    // Initialize socket connection
    try {
      await fetch('/api/socket');
      
      // Connect to the socket server
      this.socket = io({
        path: '/api/socket',
        addTrailingSlash: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      return new Promise((resolve, reject) => {
        this.socket.on('connect', () => {
          console.log('Connected to game server');
          resolve(this.socket.id);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        // Game event listeners
        this.socket.on('game:joined', (data) => this._handleCallback('gameJoined', data));
        this.socket.on('game:started', (data) => this._handleCallback('gameStarted', data));
        this.socket.on('game:update', (data) => this._handleCallback('gameUpdate', data));
        this.socket.on('game:turn', (data) => this._handleCallback('gameTurn', data));
        this.socket.on('game:battle', (data) => this._handleCallback('gameBattle', data));
        this.socket.on('game:over', (data) => this._handleCallback('gameOver', data));
        this.socket.on('player:disconnected', (data) => this._handleCallback('playerDisconnected', data));
        this.socket.on('rooms:update', (data) => this._handleCallback('roomsUpdate', data));
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Room-related methods
  createRoom(roomName, playerName) {
    if (!this.socket) return Promise.reject('Not connected to server');
    
    return new Promise((resolve) => {
      this.socket.emit('room:create', { roomName, playerName }, (response) => {
        resolve(response);
      });
    });
  }

  joinRoom(roomId, playerName) {
    if (!this.socket) return Promise.reject('Not connected to server');
    
    return new Promise((resolve) => {
      this.socket.emit('room:join', { roomId, playerName }, (response) => {
        resolve(response);
      });
    });
  }

  getRooms(callback) {
    if (!this.socket) return;
    
    this.socket.emit('rooms:get', {}, (rooms) => {
      if (callback) callback(rooms);
    });
  }

  // Game-related methods
  joinGame(playerName) {
    if (!this.socket) return Promise.reject('Not connected to server');
    
    return new Promise((resolve) => {
      this.socket.emit('game:join', { playerName }, (response) => {
        resolve(response);
      });
    });
  }

  playCard(cardId) {
    if (!this.socket) return;
    this.socket.emit('game:play-card', { cardId });
  }

  on(event, callback) {
    this.gameCallbacks[event] = callback;
  }

  off(event) {
    delete this.gameCallbacks[event];
  }

  _handleCallback(event, data) {
    if (this.gameCallbacks[event]) {
      this.gameCallbacks[event](data);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService; 