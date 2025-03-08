import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

import styles from '../styles';
import { cardTemplate, getPlayerNfts } from '../assets/index';

const CardDqn = ({ card, title, restStyles, cardRef, playerTwo }) => {
  const [nft, setNft] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Use random NFTs for each player
  useEffect(() => {
    setIsClient(true);
    // Get two different random NFTs for the two players
    const { player1Nft, player2Nft } = getPlayerNfts();
    // Assign the appropriate NFT based on which player this card belongs to
    setNft(playerTwo ? player2Nft : player1Nft);
  }, [playerTwo]);

  // Don't render anything on the server to prevent hydration mismatch
  if (!isClient || !nft) return null;

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
          src={cardTemplate.src || cardTemplate} 
          alt="card_template" 
          className={`${styles.cardDqnImg} absolute inset-0 z-10`} 
        />
        
        {/* NFT Image in the center red box */}
        <div className={`${styles.cardDqnImageContainer}`}>
          <img 
            src={nft.image.src || nft.image} 
            alt={nft.name} 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* NFT ID in the top right hexagon */}
        <div className={`${styles.cardDqnHexagon}`}>
          <span className="text-white font-bold font-size-10 flex items-center justify-center">
            {nft.id}
          </span>
        </div>
        
        {/* Attack Points in the bottom right green triangle */}
        <div className={`${styles.cardDqnTriangleAttack}`}>
          <span className="text-white font-bold text-xl flex items-center justify-center">
            {card.att || 0}
          </span>
        </div>
        
        {/* Defense Points in the bottom left red triangle */}
        <div className={`${styles.cardDqnTriangleDefense}`}>
          <span className="text-white font-bold text-xl flex items-center justify-center">
            {card.def || 0}
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