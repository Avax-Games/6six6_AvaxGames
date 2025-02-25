import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

import styles from '../styles';
import { cardTemplate, getNftById } from '../assetsDqn';

const CardDqn = ({ card, title, restStyles, cardRef, playerTwo }) => {
  const [nft, setNft] = useState(null);
  
  // Use specific NFT IDs for each player
  useEffect(() => {
    // Player 2 uses NFT ID 557, Player 1 uses NFT ID 666
    const nftId = playerTwo ? '557' : '666';
    setNft(getNftById(nftId));
  }, [playerTwo]);

  if (!nft) return null;

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      glareEnable={false}
      scale={1.1}
      transitionSpeed={1500}
      tiltReverse={true}
      perspective={1000}
      gyroscope={false}
      className="flex items-center justify-center"
    >
      <div ref={cardRef} className={`${styles.cardDqnContainer} ${restStyles || ''}`}>
        {/* Card Template Background */}
        <img 
          src={cardTemplate} 
          alt="card_template" 
          className={`${styles.cardDqnImg} absolute inset-0 z-10`} 
        />
        
        {/* NFT Image in the center red box */}
        <div className={`${styles.cardDqnImageContainer}`}>
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* NFT ID in the top right hexagon */}
        <div className={`${styles.cardDqnHexagon}`}>
          <span className="text-white font-bold text-2xl flex items-center justify-center w-full h-full">
            {nft.id}
          </span>
        </div>
        
        {/* Attack Points in the bottom right green triangle */}
        <div className={`${styles.cardDqnTriangleAttack}`}>
          <span className="text-white font-bold text-2xl flex items-center justify-center w-full h-full">
            {card.att || 7}
          </span>
        </div>
        
        {/* Defense Points in the bottom left red triangle */}
        <div className={`${styles.cardDqnTriangleDefense}`}>
          <span className="text-white font-bold text-2xl flex items-center justify-center w-full h-full">
            {card.def || 3}
          </span>
        </div>
        
        {/* Name at the bottom */}
        <div className={`${styles.cardDqnName}`}>
          <p className="text-white font-bold text-sm">
            {title || nft.name}
          </p>
        </div>
      </div>
    </Tilt>
  );
};

export default CardDqn; 