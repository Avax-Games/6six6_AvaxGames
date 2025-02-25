/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

import styles from '../styles';
import { ActionButton, Alert, Card, CardDqn, GameInfo, PlayerInfo, LetterGlitch, GameTerminal } from '../components';
import { useGlobalContext } from '../context';
import { attack, attackSound, defense, defenseSound, player01 as player01Icon, player02 as player02Icon } from '../assets';
import { playAudio } from '../utils/animation.js';

const Battle = () => {
  // Get context safely
  const context = useGlobalContext();
  const [contextReady, setContextReady] = useState(false);
  
  // Initialize state variables
  const [player2, setPlayer2] = useState({});
  const [player1, setPlayer1] = useState({});
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [additionalOutput, setAdditionalOutput] = useState([]);
  
  // Get params from URL
  const { battleName } = useParams();
  const navigate = useNavigate();
  
  // Extract context values once it's ready
  const contract = context?.contract;
  const gameData = context?.gameData;
  const battleGround = context?.battleGround;
  const walletAddress = context?.walletAddress;
  const setErrorMessage = context?.setErrorMessage;
  const showAlert = context?.showAlert;
  const setShowAlert = context?.setShowAlert;
  const player1Ref = context?.player1Ref;
  const player2Ref = context?.player2Ref;

  // Check if context is ready
  useEffect(() => {
    if (context && contract && gameData) {
      setContextReady(true);
    }
  }, [context, contract, gameData]);

  useEffect(() => {
    const getPlayerInfo = async () => {
      if (!contextReady || !contract || !gameData?.activeBattle) return;
      
      try {
        let player01Address = null;
        let player02Address = null;

        if (gameData.activeBattle.players[0].toLowerCase() === walletAddress.toLowerCase()) {
          player01Address = gameData.activeBattle.players[0];
          player02Address = gameData.activeBattle.players[1];
        } else {
          player01Address = gameData.activeBattle.players[1];
          player02Address = gameData.activeBattle.players[0];
        }

        const p1TokenData = await contract.getPlayerToken(player01Address);
        const p2TokenData = await contract.getPlayerToken(player02Address);
        const player01 = await contract.getPlayer(player01Address);
        const player02 = await contract.getPlayer(player02Address);

        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        const p1H = player01.playerHealth.toNumber();
        const p1M = player01.playerMana.toNumber();
        
        const p2Att = p2TokenData.attackStrength.toNumber();
        const p2Def = p2TokenData.defenseStrength.toNumber();
        const p2H = player02.playerHealth.toNumber();
        const p2M = player02.playerMana.toNumber();

        setPlayer1({ ...player01, att: p1Att, def: p1Def, health: p1H, mana: p1M });
        setPlayer2({ ...player02, att: p2Att, def: p2Def, health: p2H, mana: p2M });
      } catch (error) {
        if (setErrorMessage) setErrorMessage(error.message);
      }
    };

    if (contextReady) getPlayerInfo();
  }, [contract, gameData, battleName, contextReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contextReady && !gameData?.activeBattle) navigate('/');
    }, [2000]);

    return () => clearTimeout(timer);
  }, [gameData, contextReady]);

  const makeAMove = async (choice) => {
    if (!contextReady) return;
    
    playAudio(choice === 1 ? attackSound : defenseSound);

    try {
      await contract.attackOrDefendChoice(choice, battleName, { gasLimit: 200000 });

      if (setShowAlert) {
        setShowAlert({
          status: true,
          type: 'info',
          message: `Initiating ${choice === 1 ? 'attack' : 'defense'}`,
        });
      }
    } catch (error) {
      if (setErrorMessage) setErrorMessage(error);
    }
  };

  const handleTerminalCommand = async (command) => {
    if (!contextReady) return;
    
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
        try {
          await contract.quitBattle(battleName);
          if (setShowAlert) {
            setShowAlert({ status: true, type: 'info', message: `You're quitting the ${battleName}` });
          }
        } catch (error) {
          setAdditionalOutput([`Error: Failed to exit battle`]);
        }
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
        ]);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && terminalText.trim()) {
      await handleTerminalCommand(terminalText.trim());
      setTerminalText('');
    }
  };

  const handleChange = (e) => {
    setTerminalText(e.target.value);
  };

  if (!contextReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <p className="text-white text-2xl">Loading battle...</p>
      </div>
    );
  }

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

      <div className={`${styles.flexCenter} ${styles.gameContainer} relative z-10`}>
        {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

        <div className="flex flex-col items-center justify-center w-full h-full">
          {/* Main battle area with cards aligned in the same vertical axis */}
          <div className="flex flex-col items-center justify-center">
            {/* Player info and cards in a centered column layout */}
            <div className="flex flex-col items-center relative">
              {/* Player 2 health bar positioned to the left of center */}
              <div className="absolute top-1/4 right-[100%] mr-4">
                <PlayerInfo player={player2} playerIcon={player02Icon} mt />
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
                  imgUrl={defense}
                  handleClick={() => makeAMove(2)}
                  restStyles="mr-2 mt-2 hover:border-red-600 scale-90"
                />
                <ActionButton
                  imgUrl={attack}
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
              <div className="absolute bottom-1/4 left-[100%] ml-4">
                <PlayerInfo player={player1} playerIcon={player01Icon} />
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
        <div className="absolute right-12 top-[40%] -translate-y-1/2 w-[400px] h-[500px] z-20">
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
};

export default Battle;
