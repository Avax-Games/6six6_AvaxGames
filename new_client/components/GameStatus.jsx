'use client'

import React from 'react';

const GameStatus = ({ gameState, playerStats, opponentStats }) => {
  return (
    <div className="game-status w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="text-2xl font-bold text-white mb-4 md:mb-0">Card Battle Arena</div>
        <div className="game-round">
          {gameState.status === 'waiting' && 'Waiting for opponent...'}
          {gameState.status === 'playing' && `Round ${gameState.round}`}
          {gameState.status === 'finished' && 'Game Over'}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="player-stats flex-1">
          <div className="player-name">You</div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="stat-badge hp-badge">
              HP: {playerStats.hp}
            </div>
            <div className="stat-badge wins-badge">
              Wins: {playerStats.wins}
            </div>
          </div>
          {gameState.status === 'playing' && (
            <div className="mt-3 text-center">
              {gameState.currentTurn === 'player' ? (
                <span className="px-3 py-1 bg-green-600 rounded-full text-sm font-semibold">Your Turn</span>
              ) : (
                <span className="px-3 py-1 bg-gray-600 rounded-full text-sm font-semibold">Opponent's Turn</span>
              )}
            </div>
          )}
        </div>
        
        {gameState.status !== 'waiting' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl font-bold text-center">
              {gameState.status === 'playing' ? 'VS' : 
               gameState.winner === 'player' ? 'You Won!' : 
               gameState.winner === 'opponent' ? 'Opponent Won' : 'Draw'}
            </div>
          </div>
        )}
        
        <div className="player-stats flex-1">
          <div className="player-name">Opponent</div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="stat-badge hp-badge">
              HP: {opponentStats.hp}
            </div>
            <div className="stat-badge wins-badge">
              Wins: {opponentStats.wins}
            </div>
          </div>
          {gameState.status === 'playing' && (
            <div className="mt-3 text-center">
              {gameState.currentTurn === 'opponent' ? (
                <span className="px-3 py-1 bg-green-600 rounded-full text-sm font-semibold">Their Turn</span>
              ) : (
                <span className="px-3 py-1 bg-gray-600 rounded-full text-sm font-semibold">Waiting</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStatus; 