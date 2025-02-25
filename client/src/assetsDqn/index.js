// Import card template
import cardTemplate from './card-template.png';

// Import NFT images
import nft27 from './nfts/27.jpg';
import nft456 from './nfts/456.jpg';
import nft789 from './nfts/789.jpg';
import nft404 from './nfts/404.jpg';
import nft557 from './nfts/557.jpg';
import nft4861 from './nfts/4861.jpg';

// Create an array of all NFT images
export const allNfts = [
  { id: '27', image: nft27, name: 'Cyber Warrior' },
  { id: '456', image: nft456, name: 'Neon Samurai' },
  { id: '789', image: nft789, name: 'Digital Phantom' },
  { id: '404', image: nft404, name: 'Quantum Knight' },
  { id: '557', image: nft557, name: 'Void Assassin' },
  { id: '4861', image: nft4861, name: 'Crimson Reaper' },
];

// Export individual assets
export {
  cardTemplate,
  nft27,
  nft456,
  nft789,
  nft404,
  nft557,
  nft4861,
};

// Helper function to get NFT by ID
export const getNftById = (id) => {
  return allNfts.find(nft => nft.id === id) || allNfts[0];
};

// Helper function to get random NFT
export const getRandomNft = () => {
  return allNfts[Math.floor(Math.random() * allNfts.length)];
};

// Helper function to get two different random NFTs for the two players
export const getPlayerNfts = () => {
  const shuffled = [...allNfts].sort(() => 0.5 - Math.random());
  return {
    player1Nft: shuffled[0],
    player2Nft: shuffled[1]
  };
}; 