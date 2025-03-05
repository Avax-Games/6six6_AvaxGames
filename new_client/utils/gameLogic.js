// Card elements and their strengths/weaknesses
const elements = ['fire', 'water', 'earth', 'air'];
const elementRelations = {
  fire: { strong: 'air', weak: 'water' },
  water: { strong: 'fire', weak: 'earth' },
  earth: { strong: 'water', weak: 'air' },
  air: { strong: 'earth', weak: 'fire' },
};

// Card names for each element
const cardNames = {
  fire: ['Phoenix', 'Dragon', 'Inferno', 'Volcano', 'Ember', 'Blaze', 'Flame'],
  water: ['Kraken', 'Tsunami', 'Whirlpool', 'Hydra', 'Mermaid', 'Deluge', 'Wave'],
  earth: ['Golem', 'Mountain', 'Quake', 'Boulder', 'Forest', 'Tectonic', 'Crystal'],
  air: ['Griffin', 'Tornado', 'Tempest', 'Zephyr', 'Hurricane', 'Gale', 'Cloud'],
};

// Generate a random number between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random element
function getRandomElement() {
  return elements[Math.floor(Math.random() * elements.length)];
}

// Generate a random card name based on element
function getRandomCardName(element) {
  const names = cardNames[element];
  return names[Math.floor(Math.random() * names.length)];
}

// Generate a deck of random cards
export function generateDeck(count) {
  const deck = [];
  
  for (let i = 0; i < count; i++) {
    const element = getRandomElement();
    const card = {
      id: `card_${Date.now()}_${i}`,
      name: getRandomCardName(element),
      element,
      attack: getRandomInt(1, 10),
      defense: getRandomInt(1, 10),
    };
    
    deck.push(card);
  }
  
  return deck;
}

// Calculate the result of a battle between two cards
export function calculateBattleResult(card1, card2) {
  // Base attack and defense values
  let card1Power = card1.attack;
  let card2Power = card1.defense;
  let card2Attack = card2.attack;
  let card1Defense = card2.defense;
  
  // Element bonuses
  const card1Element = card1.element;
  const card2Element = card2.element;
  
  let description = '';
  
  // Check for elemental advantages
  if (elementRelations[card1Element].strong === card2Element) {
    // Card 1 has advantage over Card 2
    card1Power = Math.floor(card1Power * 1.5);
    description += `${card1.name} (${card1Element}) has elemental advantage over ${card2.name} (${card2Element})! `;
  } else if (elementRelations[card1Element].weak === card2Element) {
    // Card 1 is weak against Card 2
    card1Power = Math.floor(card1Power * 0.75);
    description += `${card1.name} (${card1Element}) is weak against ${card2.name} (${card2Element})! `;
  }
  
  if (elementRelations[card2Element].strong === card1Element) {
    // Card 2 has advantage over Card 1
    card2Attack = Math.floor(card2Attack * 1.5);
    description += `${card2.name} (${card2Element}) has elemental advantage over ${card1.name} (${card1Element})! `;
  } else if (elementRelations[card2Element].weak === card1Element) {
    // Card 2 is weak against Card 1
    card2Attack = Math.floor(card2Attack * 0.75);
    description += `${card2.name} (${card2Element}) is weak against ${card1.name} (${card1Element})! `;
  }
  
  // Calculate damage
  const damage1 = Math.max(0, card1Power - card1Defense);
  const damage2 = Math.max(0, card2Attack - card2Power);
  
  // Determine winner
  let winner, damage;
  
  if (damage1 > damage2) {
    winner = 'player1';
    damage = damage1;
    description += `${card1.name} deals ${damage} damage to opponent!`;
  } else if (damage2 > damage1) {
    winner = 'player2';
    damage = damage2;
    description += `${card2.name} deals ${damage} damage to opponent!`;
  } else {
    winner = 'draw';
    damage = 0;
    description += 'The battle ends in a draw!';
  }
  
  return {
    winner,
    damage,
    description,
  };
} 