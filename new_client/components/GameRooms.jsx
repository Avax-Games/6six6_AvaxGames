'use client'

import React, { useState, useEffect } from 'react';

const GameRooms = ({ onJoinRoom, onCreateRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
    // Poll for rooms every 5 seconds
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(data.rooms || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load game rooms. Please try again later.');
      setLoading(false);
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    
    onCreateRoom(roomName);
    setRoomName('');
  };

  const handleJoinRoom = (roomId) => {
    onJoinRoom(roomId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl text-white border border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Game Rooms
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Room Form */}
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Create New Room</h3>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-300 mb-2">
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!roomName.trim()}
            >
              Create Room
            </button>
          </form>
        </div>
        
        {/* Available Rooms */}
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-4">{error}</div>
          ) : rooms.length === 0 ? (
            <div className="text-gray-400 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
              <p>No rooms available</p>
              <p className="text-sm mt-2">Create a new room to start playing!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {rooms.map(room => (
                <div 
                  key={room.id} 
                  className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{room.name}</h4>
                      <p className="text-xs text-gray-400">Players: {room.players}/2</p>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        room.players < 2 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                      disabled={room.players >= 2}
                    >
                      {room.players < 2 ? 'Join' : 'Full'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={fetchRooms}
            className="mt-4 w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Rooms
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Join an existing room or create your own to start playing!</p>
      </div>
    </div>
  );
};

export default GameRooms; 