import ReactTooltip from 'react-tooltip';
import React, { useEffect, useState } from 'react';
import styles from '../styles';

const healthPoints = 25;

// Enhanced health level function with red color gradients
const healthLevel = (points) => {
  if (points >= 20) return 'from-red-500 to-red-600';
  if (points >= 15) return 'from-red-600 to-red-700';
  if (points >= 10) return 'from-red-700 to-red-800';
  if (points >= 5) return 'from-red-800 to-red-900';
  return 'from-red-900 to-black';
};

// Get triangle color based on health - only using red shades
const getTriangleColor = (points) => {
  if (points >= 15) return 'text-red-200';
  if (points >= 10) return 'text-red-300';
  if (points >= 5) return 'text-red-400';
  return 'text-red-500';
};

const marginIndexing = (index) => (index !== healthPoints - 1 ? 'mr-2' : 'mr-0');

// Particle component for low health effect - using red particles
const HealthParticle = ({ isLowHealth }) => {
  if (!isLowHealth) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div 
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-red-600 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            boxShadow: '0 0 5px #ff0000, 0 0 10px rgba(255, 0, 0, 0.5)'
          }}
        />
      ))}
    </div>
  );
};

const PlayerInfo = ({ player, playerIcon, mt }) => {
  const [animateHealth, setAnimateHealth] = useState(false);
  const [prevHealth, setPrevHealth] = useState(player.health);
  const [takingDamage, setTakingDamage] = useState(false);
  
  // Trigger animation when health changes
  useEffect(() => {
    setAnimateHealth(true);
    
    // Check if taking damage
    if (player.health < prevHealth) {
      setTakingDamage(true);
      setTimeout(() => setTakingDamage(false), 600);
    }
    
    setPrevHealth(player.health);
    const timer = setTimeout(() => setAnimateHealth(false), 500);
    return () => clearTimeout(timer);
  }, [player.health, prevHealth]);

  // Determine if health is low for warning effect
  const isLowHealth = player.health <= 5;
  const isCritical = player.health <= 3;

  return (
    <div className={`${styles.flexCenter} ${mt ? 'mt-4' : 'mb-4'}`}>
      <div className="flex items-center">
        {/* Health Bar */}
        <div
          data-for={`Health-${mt ? '1' : '2'}`}
          data-tip={`Health: ${player.health}`}
          className={`
            relative overflow-hidden 
            ${isLowHealth ? 'border-2 border-red-500' : 'border-2 border-red-800'} 
            ${takingDamage ? 'animate-shake' : ''}
            ${isCritical ? 'animate-glitch' : ''}
            health-bar-shine scanline
            bg-black bg-opacity-90
            animate-red-pulse
            rounded-md
            h-12
            w-96
            mx-2
            shadow-[0_0_15px_rgba(255,0,0,0.4)]
          `}
        >
          {/* Background health bar */}
          <div className="absolute inset-0 bg-black bg-opacity-80 rounded-md"></div>
          
          {/* Animated health bar background */}
          <div 
            className={`absolute h-full bg-gradient-to-r ${healthLevel(player.health)} transition-all duration-500 ease-out rounded-md ${isLowHealth ? 'animate-pulse' : ''}`}
            style={{ 
              width: `${(player.health / healthPoints) * 100}%`,
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.4)'
            }}
          ></div>
          
          {/* Grid overlay for futuristic look */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMCwgMCwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"></div>
          
          {/* Low health particles */}
          <HealthParticle isLowHealth={isLowHealth} />
          
          {/* Health triangles */}
          <div className="relative flex items-center h-full z-10 px-3 py-1">
            {[...Array(player.health).keys()].map((item, index) => (
              <div
                key={`player-item-${item}`}
                className={`
                  ${marginIndexing(index)}
                  transition-all duration-300 transform hover:scale-125
                  flex items-center justify-center
                  ${animateHealth ? 'animate-bounce' : ''}
                  ${index % 2 === 0 ? 'animate-float-slow' : 'animate-float-slower'}
                `}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transform: `translateY(${Math.sin(index) * 2}px)`
                }}
              >
                <span 
                  className={`${getTriangleColor(player.health)} text-3xl triangle-glow`}
                  style={{ 
                    filter: 'drop-shadow(0 0 5px rgba(255, 0, 0, 0.9)) drop-shadow(0 0 2px white)',
                    textShadow: '0 0 10px rgba(255, 0, 0, 0.8), 0 0 5px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  🔺
                </span>
              </div>
            ))}
          </div>
          
          {/* Health counter - adjusted position and z-index */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-80 px-2 py-0.5 rounded-sm text-red-400 font-mono font-bold text-sm border border-red-800 z-20">
            <span className="mr-1 text-xs">HP</span>
            {player.health}/{healthPoints}
          </div>
          
          {/* Left edge accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
          
          {/* Top edge tech details */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-700"></div>
          
          {/* Bottom edge tech details */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-red-700"></div>
        </div>

        {/* Mana Display - Now positioned to the right of health bar */}
        <div
          data-for={`Mana-${mt ? '1' : '2'}`}
          data-tip="Mana"
          className={`
            ${styles.flexCenter}
            bg-gradient-to-br from-red-900 to-black 
            transition-all duration-300 
            hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]
            border-2 border-red-800
            text-red-400
            font-mono
            font-bold
            relative
            overflow-hidden
            w-12
            h-12
            rounded-full
            ml-2
            shadow-[0_0_10px_rgba(255,0,0,0.3)]
          `}
        >
          {/* Mana value */}
          <span className="relative z-10 text-lg">{player.mana || 0}</span>
          
          {/* Mana label */}
          <span className="absolute top-0 left-0 text-[8px] text-red-600 ml-1 mt-0.5">MP</span>
          
          {/* Decorative circle */}
          <div className="absolute inset-0 rounded-full border border-red-800/50"></div>
          
          {/* Grid overlay for futuristic look */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAxMCA1IE0gNSAwIEwgNSAxMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMCwgMCwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')]"></div>
        </div>
      </div>

      <ReactTooltip id={`Player-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#300" />
      <ReactTooltip id={`Health-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#300" />
      <ReactTooltip id={`Mana-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#300" />
    </div>
  );
};

export default PlayerInfo;
