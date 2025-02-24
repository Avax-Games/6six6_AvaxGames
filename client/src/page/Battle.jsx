/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

import styles from '../styles';
import { ActionButton, Alert, Card, GameInfo, PlayerInfo, LetterGlitch, GameTerminal } from '../components';
import { useGlobalContext } from '../context';
import { attack, attackSound, defense, defenseSound, player01 as player01Icon, player02 as player02Icon } from '../assets';
import { playAudio } from '../utils/animation.js';

const Battle = () => {
  const { contract, gameData, battleGround, walletAddress, setErrorMessage, showAlert, setShowAlert, player1Ref, player2Ref } = useGlobalContext();
  const [player2, setPlayer2] = useState({});
  const [player1, setPlayer1] = useState({});
  const { battleName } = useParams();
  const navigate = useNavigate();
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [additionalOutput, setAdditionalOutput] = useState([]);

  useEffect(() => {
    const getPlayerInfo = async () => {
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
        const player01 = await contract.getPlayer(player01Address);
        const player02 = await contract.getPlayer(player02Address);

        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        const p1H = player01.playerHealth.toNumber();
        const p1M = player01.playerMana.toNumber();
        const p2H = player02.playerHealth.toNumber();
        const p2M = player02.playerMana.toNumber();

        setPlayer1({ ...player01, att: p1Att, def: p1Def, health: p1H, mana: p1M });
        setPlayer2({ ...player02, att: 'X', def: 'X', health: p2H, mana: p2M });
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, gameData, battleName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) navigate('/');
    }, [2000]);

    return () => clearTimeout(timer);
  }, []);

  const makeAMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);

    try {
      await contract.attackOrDefendChoice(choice, battleName, { gasLimit: 200000 });

      setShowAlert({
        status: true,
        type: 'info',
        message: `Initiating ${choice === 1 ? 'attack' : 'defense'}`,
      });
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleTerminalCommand = async (command) => {
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
          setShowAlert({ status: true, type: 'info', message: `You're quitting the ${battleName}` });
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
          "/help  - Show this help message"
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

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className={`${styles.flexBetween} ${styles.gameContainer} relative z-10`}>
        {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

        <PlayerInfo player={player2} playerIcon={player02Icon} mt />

        <div className={`${styles.flexCenter} flex-col my-10`}>
          <Card
            card={player2}
            title={player2?.playerName}
            cardRef={player2Ref}
            playerTwo
          />

          <div className="flex items-center flex-row">
            <ActionButton
              imgUrl={attack}
              handleClick={() => makeAMove(1)}
              restStyles="mr-2 hover:border-yellow-400"
            />

            <Card
              card={player1}
              title={player1?.playerName}
              cardRef={player1Ref}
              restStyles="mt-3"
            />

            <ActionButton
              imgUrl={defense}
              handleClick={() => makeAMove(2)}
              restStyles="ml-6 hover:border-red-600"
            />
          </div>
        </div>

        <PlayerInfo player={player1} playerIcon={player01Icon} />
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
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-[400px] h-[500px] z-20">
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
