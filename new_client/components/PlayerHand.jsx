'use client'

import React from 'react';
import Card from './Card';

const PlayerHand = ({ cards, onCardSelect, isActive, selectedCardId }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Your Hand</h2>
        <div className="text-md text-gray-300">
          {isActive ? (
            <span className="text-green-400 font-semibold">Select a card to play</span>
          ) : (
            <span className="text-yellow-400">Waiting for opponent to make a move...</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {cards.length > 0 ? (
          cards.map(card => (
            <div 
              key={card.id} 
              className={`transition-all duration-300 ${selectedCardId === card.id ? 'transform translate-y-[-20px]' : 'hover:translate-y-[-10px]'}`}
            >
              <Card
                card={card}
                onClick={onCardSelect}
                isPlayable={isActive}
                isSelected={selectedCardId === card.id}
              />
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-8">
            No cards available in your hand
          </div>
        )}
      </div>
      
      {selectedCardId && isActive && (
        <div className="mt-6 text-center">
          <div className="text-white mb-2">Card selected! Ready to play?</div>
        </div>
      )}
    </div>
  );
};

export default PlayerHand; 