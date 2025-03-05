'use client'

import React from 'react';
import Card from './Card';

const GameBoard = ({ playerCard, opponentCard, battleResult }) => {
  return (
    <div className="game-board">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold text-white mb-4">Opponent's Card</h3>
          <div className="h-64 flex items-center justify-center">
            {opponentCard ? (
              <Card card={opponentCard} isPlayable={false} />
            ) : (
              <div className="waiting-card">
                <div className="text-center">
                  <div className="text-2xl mb-2">?</div>
                  <div>Waiting...</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="battle-arena">
            {battleResult ? (
              <div>
                <div className="battle-result">
                  {battleResult.winner === 'player' && '🎉 You Won! 🎉'}
                  {battleResult.winner === 'opponent' && '😔 You Lost 😔'}
                  {battleResult.winner === 'draw' && '🤝 Draw 🤝'}
                </div>
                <div className="battle-description">
                  {battleResult.description}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold mb-2">Battle Arena</div>
                <div className="text-sm opacity-80">Cards will battle here</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold text-white mb-4">Your Card</h3>
          <div className="h-64 flex items-center justify-center">
            {playerCard ? (
              <Card card={playerCard} isPlayable={false} />
            ) : (
              <div className="waiting-card">
                <div className="text-center">
                  <div className="text-lg mb-2">Select a card</div>
                  <div className="text-sm opacity-80">from your hand below</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard; 