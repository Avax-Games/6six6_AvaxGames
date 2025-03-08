import ReactTooltip from "react-tooltip";
import React, { useEffect, useState } from "react";
import styles from "../styles";

// CSS for blood animations
const bloodAnimationStyles = `
  @keyframes blood-drip {
    0% { height: 0; opacity: 0; }
    10% { opacity: 0.9; }
    70% { height: 20px; opacity: 0.8; }
    100% { height: 40px; opacity: 0; transform: translateY(100%); }
  }
  
  .animate-blood-drip {
    animation: blood-drip 3s ease-in infinite;
  }
  
  @keyframes particle {
    0% { transform: translateY(0) scale(1); opacity: 0.8; }
    100% { transform: translateY(25px) scale(0); opacity: 0; }
  }
  
  .animate-particle {
    animation: particle 2s ease-out infinite;
  }
  
  .health-bar-shine::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 0, 0, 0.2),
      transparent
    );
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { left: -100%; }
    20% { left: 100%; }
    100% { left: 100%; }
  }
  
  .animate-red-pulse {
    animation: red-pulse 2s infinite;
  }
  
  @keyframes red-pulse {
    0% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); }
    50% { box-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
    100% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); }
  }
`;

const healthPoints = 25;

// Enhanced health level function with red color gradients
const healthLevel = (points) => {
  if (points >= 20) return "from-red-600 to-red-700";
  if (points >= 15) return "from-red-700 to-red-800";
  if (points >= 10) return "from-red-800 to-red-900";
  if (points >= 5) return "from-red-900 to-red-950";
  return "from-red-950 to-black";
};

const marginIndexing = (index) =>
  index !== healthPoints - 1 ? "mr-1" : "mr-0";

// Particle component for low health effect - using red particles
const HealthParticle = ({ isLowHealth }) => {
  if (!isLowHealth) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blood particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-particle"
          style={{
            width: `${1.5 + Math.random() * 2.5}px`,
            height: `${1.5 + Math.random() * 2.5}px`,
            background: `rgba(${200 + Math.random() * 55}, 0, 0, ${
              0.7 + Math.random() * 0.3
            })`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            boxShadow: "0 0 5px #ff0000, 0 0 10px rgba(255, 0, 0, 0.7)",
          }}
        />
      ))}

      {/* Blood drip effect */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`drip-${i}`}
          className="absolute w-[3px] animate-blood-drip"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,0,0,0.8), rgba(128,0,0,0.9))",
            left: `${15 + i * 25 + Math.random() * 10}%`,
            top: "0",
            height: `${8 + Math.random() * 20}px`,
            animationDelay: `${i * 0.5 + Math.random()}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            boxShadow: "0 0 3px rgba(255, 0, 0, 0.5)",
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
    <div className={`${styles.flexCenter} ${mt ? "mt-0" : "mb-0"}`}>
      {/* Apply blood animation styles */}
      <style dangerouslySetInnerHTML={{ __html: bloodAnimationStyles }} />

      <div className="flex items-center">
        {/* Health Bar */}
        <div
          data-for={`Health-${mt ? "1" : "2"}`}
          data-tip={`Health: ${player.health}`}
          className={`
            relative overflow-hidden 
            ${
              isLowHealth ? "border-2 border-red-500" : "border border-red-700"
            } 
            ${takingDamage ? "animate-shake" : ""}
            ${isCritical ? "animate-glitch" : ""}
            health-bar-shine scanline
            bg-black bg-opacity-90
            animate-red-pulse
            rounded-md
            h-12
            w-64
            mx-1
            shadow-[0_0_15px_rgba(255,0,0,0.5)]
          `}
          style={{
            boxShadow: isLowHealth
              ? "0 0 10px #ff0000, 0 0 20px rgba(255, 0, 0, 0.5), inset 0 0 5px rgba(255, 0, 0, 0.5)"
              : "0 0 10px rgba(255, 0, 0, 0.4), inset 0 0 5px rgba(255, 0, 0, 0.3)",
          }}
        >
          {/* Blood splatter effect for critical health */}
          {isCritical && (
            <div
              className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI1IiBmaWxsPSJyZ2JhKDI1NSwwLDAsMC4zKSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMjAiIHI9IjMiIGZpbGw9InJnYmEoMjU1LDAsMCwwLjQpIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIxNSIgcj0iNyIgZmlsbD0icmdiYSgyNTUsMCwwLDAuMykiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjgwIiByPSI0IiBmaWxsPSJyZ2JhKDI1NSwwLDAsMC41KSIvPjxjaXJjbGUgY3g9IjgwIiBjeT0iNjAiIHI9IjYiIGZpbGw9InJnYmEoMjU1LDAsMCwwLjQpIi8+PC9zdmc+")',
                opacity: 0.7,
              }}
            />
          )}

          {/* Background health bar */}
          <div className="absolute inset-0 bg-black bg-opacity-80 rounded-md"></div>

          {/* Animated health bar background */}
          <div
            className={`absolute h-full bg-gradient-to-r ${healthLevel(
              player.health
            )} transition-all duration-500 ease-out rounded-md ${
              isLowHealth ? "animate-pulse" : ""
            }`}
            style={{
              width: `${(player.health / healthPoints) * 100}%`,
              boxShadow:
                "0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.4), inset 0 0 15px rgba(255, 0, 0, 0.5)",
              backgroundImage:
                "linear-gradient(90deg, rgba(255,0,0,0.8) 0%, rgba(200,0,0,0.9) 100%)",
              borderRight: "2px solid rgba(255, 0, 0, 0.8)",
            }}
          ></div>

          {/* Blood vein overlay */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiPjxwYXRoIGQ9Ik0wLDUgQzIwLDIsNDAsMTAsNjAsMiBDODAsOCwxMDAsMiwxMDAsNSIgc3Ryb2tlPSJyZ2JhKDI1NSwwLDAsMC41KSIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+")',
              backgroundSize: "100px 10px",
              backgroundRepeat: "repeat",
            }}
          ></div>

          {/* Grid overlay for futuristic look */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMCwgMCwgMC4zKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"></div>

          {/* Low health particles */}
          <HealthParticle isLowHealth={isLowHealth} />

          {/* Health triangles */}
          <div className="relative flex items-center h-full z-10 px-3 py-1">
            {[...Array(player.health).keys()].map((item, index) => (
              <div
                key={`player-item-${item}`}
                className={`
                  ${marginIndexing(index)}
                  flex items-center justify-center
                `}
              >
                <span
                  className={`text-red-700 text-lg`}
                  style={{
                    fontSize: "1.5rem",
                    color: "#7f0000", // Dark red color
                    filter: "drop-shadow(0 0 2px rgba(255, 0, 0, 0.7))",
                    transform: "scale(1.2)",
                  }}
                >
                  🔺
                </span>
              </div>
            ))}
          </div>

          {/* Health counter - adjusted position and z-index */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-80 px-1.5 py-0.5 rounded-sm text-red-400 font-mono font-bold text-sm border border-red-800 z-20">
            <span className="mr-1 text-[10px]">HP</span>
            {player.health}/{healthPoints}
          </div>

          {/* Left edge accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>

          {/* Top edge tech details */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-700"></div>

          {/* Bottom edge tech details */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-700"></div>
        </div>
      </div>

      <ReactTooltip
        id={`Player-${mt ? "1" : "2"}`}
        effect="solid"
        backgroundColor="#300"
      />
      <ReactTooltip
        id={`Health-${mt ? "1" : "2"}`}
        effect="solid"
        backgroundColor="#300"
      />
    </div>
  );
};

export default PlayerInfo;
