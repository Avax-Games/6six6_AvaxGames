"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Terminal } from 'lucide-react';

import {
  Alert,
  ActionButton,
  PlayerInfo,
  LetterGlitch,
  GameTerminal,
  CardDqn,
  Loading
} from '../../../components';

import { 
  attackImage as attack, 
  attackSound, 
  defenseImage as defense, 
  defenseSound 
} from '../../../assets';

import { playAudio } from '../../../utils/animation';

// Mock data for UI display
const mockPlayer1 = {
  playerName: "Player 1",
  att: 10,
  def: 8,
  health: 20,
  mana: 10
};

const mockPlayer2 = {
  playerName: "Player 2",
  att: 9,
  def: 11,
  health: 15,
  mana: 8
};

export default function Battle() {
  // Initialize state variables
  const [player2] = useState(mockPlayer2);
  const [player1] = useState(mockPlayer1);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [additionalOutput, setAdditionalOutput] = useState([]);
  const [showAlert, setShowAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get params from URL
  const params = useParams();
  const battleName = params.id;
  
  // Mock refs for cards
  const player1Ref = useRef();
  const player2Ref = useRef();

  // Add useEffect to simulate loading and fix hydration issues
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Slightly longer to appreciate the loader

    return () => clearTimeout(timer);
  }, []);

  // If we're still loading, don't render the full component
  if (isLoading) {
    return <Loading />;
  }

  const makeAMove = (choice) => {
    // UI-only functionality
    playAudio(choice === 1 ? attackSound : defenseSound);
    
    setShowAlert({
      status: true,
      type: 'info',
      message: `Initiating ${choice === 1 ? 'attack' : 'defense'} `,
    });
    
    // Clear alert after 3 seconds
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const handleTerminalCommand = (command) => {
    const cmd = command.toLowerCase().trim();
    
    switch(cmd) {
      case '/rules':
        setAdditionalOutput([
          "Game Rules:",
          "1. Card with higher attack damages enemy",
          "2. Card with higher defense blocks enemy",
          "3. First player to lose all health loses",
          "4. Attacking costs 2 Mana",
          "5. Defending costs 3 Mana",
          "6. Each round restores 3 Mana"
        ]);
        break;
        
      case '/exit':
        setShowAlert({ 
          status: true, 
          type: 'info', 
          message: `You're quitting the ${battleName || 'battle'} ` 
        });
        
        // Clear alert after 3 seconds
        setTimeout(() => {
          setShowAlert(null);
        }, 3000);
        break;
        
      case '/help':
        setAdditionalOutput([
          "Available Commands:",
          "/rules - Show game rules",
          "/exit  - Exit current battle",
          "/help  - Show this help message"
        ]);
        break;
        
      default:
        setAdditionalOutput([
          "Unknown command. Available commands:",
          "/rules - Show game rules",
          "/exit  - Exit current battle",
          "/help  - Show this help message"
        ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && terminalText.trim()) {
      handleTerminalCommand(terminalText.trim());
      setTerminalText('');
    }
  };

  const handleChange = (e) => {
    setTerminalText(e.target.value);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className="flex items-center justify-center w-full h-full relative z-10">
        {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

        <div className="flex flex-col items-center justify-center w-full h-full">
          {/* Main battle area with cards aligned in the same vertical axis */}
          <div className="flex flex-col items-center justify-center">
            {/* Player info and cards in a centered column layout */}
            <div className="flex flex-col items-center relative">
              {/* Player 2 health bar positioned to the left of center */}
              <div className="absolute top-[20%] right-[100%] mr-4">
                <PlayerInfo player={player2} />
              </div>
              
              {/* Player 2 card centered */}
              <div className="mb-1">
                <CardDqn
                  card={player2}
                  title={player2?.playerName}
                  cardRef={player2Ref}
                  playerTwo
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center">
                <ActionButton
                  imgUrl={defense.src || defense}
                  handleClick={() => makeAMove(2)}
                  restStyles="mr-2 mt-2 hover:border-red-600 scale-90"
                />
                <ActionButton
                  imgUrl={attack.src || attack}
                  handleClick={() => makeAMove(1)}
                  restStyles="ml-2 mt-2 hover:border-green-400 scale-90"
                />
              </div>

              {/* Player 1 card centered */}
              <div className="mt-0">
                <CardDqn
                  card={player1}
                  title={player1?.playerName}
                  cardRef={player1Ref}
                />
              </div>
              
              {/* Player 1 health bar positioned to the right of center */}
              <div className="absolute bottom-[20%] left-[100%] ml-4">
                <PlayerInfo player={player1} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <div
          className="bg-black w-10 h-10 rounded-md cursor-pointer flex items-center justify-center border border-red-500/30"
          onClick={() => setShowTerminal(!showTerminal)}
        >
          <Terminal 
            size={24} 
            className={`transition-colors duration-200 ${
              showTerminal ? 'text-red-500' : 'text-white hover:text-red-500'
            }`}
          />
        </div>
      </div>

      {showTerminal && (
        <div className="absolute right-15 top-[35%] -translate-y-1/2 w-[400px] h-[500px] z-20">
          <GameTerminal
            welcomeMessage="Battle Terminal - Type /help for commands"
            terminalText={terminalText}
            handleChange={handleChange}
            handleKeyPress={handleKeyPress}
            additionalOutput={additionalOutput}
          />
        </div>
      )}
    </div>
  );
}
