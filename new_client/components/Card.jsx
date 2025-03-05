'use client'

import React from 'react';

const Card = ({ card, onClick, isPlayable, isSelected }) => {
  const cardStyles = `
    card
    ${isPlayable ? 'cursor-pointer' : 'opacity-80'}
    ${isSelected ? 'ring-4 ring-yellow-400 scale-105 shadow-xl' : ''}
  `;

  const getElementClass = (element) => {
    switch (element) {
      case 'fire': return 'card-element-fire';
      case 'water': return 'card-element-water';
      case 'earth': return 'card-element-earth';
      case 'air': return 'card-element-air';
      default: return 'card-default';
    }
  };

  const elementClass = getElementClass(card.element);
  
  // Extract just the card number from the ID for cleaner display
  const cardNumber = card.id.split('_')[2] || card.id;

  return (
    <div 
      className={`${cardStyles} ${elementClass}`}
      onClick={() => isPlayable && onClick(card)}
      role="button"
      tabIndex={isPlayable ? 0 : -1}
      aria-pressed={isSelected}
    >
      <div className="card-header">
        {card.name || card.element.charAt(0).toUpperCase() + card.element.slice(1)}
      </div>
      
      <div className="card-id">
        {cardNumber}
      </div>
      
      <div className="card-stats">
        <div className="stat-circle attack-stat" title="Attack">
          {card.attack}
        </div>
        <div className="stat-circle defense-stat" title="Defense">
          {card.defense}
        </div>
      </div>
    </div>
  );
};

export default Card; 