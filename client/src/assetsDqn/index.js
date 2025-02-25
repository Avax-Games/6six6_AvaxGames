// Import card template
import cardTemplate from './card-template.png';

// Import NFT images
import nft27 from './nfts/27.jpg';
import nft456 from './nfts/456.jpg';
import nft789 from './nfts/789.jpg';
import nft484 from './nfts/484.jpg';
import nft557 from './nfts/557.jpg';
import nft666 from './nfts/666.jpg';

// Create an array of all NFT images
export const allNfts = [
  { id: '27', image: nft27, name: 'Cyber Warrior' },
  { id: '456', image: nft456, name: 'Neon Samurai' },
  { id: '789', image: nft789, name: 'Digital Phantom' },
  { id: '484', image: nft484, name: 'Quantum Knight' },
  { id: '557', image: nft557, name: 'Void Assassin' },
  { id: '666', image: nft666, name: 'Crimson Reaper' },
];

// Export individual assets
export {
  cardTemplate,
  nft27,
  nft456,
  nft789,
  nft484,
  nft557,
  nft666,
};

// Helper function to get NFT by ID
export const getNftById = (id) => {
  return allNfts.find(nft => nft.id === id) || allNfts[0];
};

// Helper function to get random NFT
export const getRandomNft = () => {
  return allNfts[Math.floor(Math.random() * allNfts.length)];
}; 