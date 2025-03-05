'use client'

import React, { useState } from 'react';

const GameLobby = ({ onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    
    setIsJoining(true);
    onJoinGame(playerName);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl text-white border border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Card Battle Arena
      </h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-2">
          Welcome to the ultimate card battle experience!
        </p>
        <p className="text-gray-400 text-sm">
          Enter your name to begin your journey
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            required
            disabled={isJoining}
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isJoining 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1'
          }`}
          disabled={isJoining || !playerName.trim()}
        >
          {isJoining ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining Game...
            </span>
          ) : (
            'Enter Battle Arena'
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Powered by Web3 Technology</p>
      </div>
    </div>
  );
};

export default GameLobby; 