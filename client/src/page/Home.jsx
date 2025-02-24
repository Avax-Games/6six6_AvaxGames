import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CustomButton,
  CustomInput,
  CircularText,
  LetterGlitch,
  GameLoad,
  GameTerminal,
} from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";

const Home = () => {
  const { contract, walletAddress, gameData, setShowAlert, setErrorMessage, setBattleName } =
    useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const [terminalText, setTerminalText] = useState("");
  const [showPrompt, setShowPrompt] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isExistingPlayer, setIsExistingPlayer] = useState(false);
  const [availableBattles, setAvailableBattles] = useState([]);
  const [waitBattle, setWaitBattle] = useState(false);
  const [additionalOutput, setAdditionalOutput] = useState([]);
  const navigate = useNavigate();

  const handleHover = () => {
    const timer = setTimeout(() => {
      console.log("666");
    }, 2000);

    return () => clearTimeout(timer);
  };

  const handleCommand = async (command) => {
    if (!isExistingPlayer) {
      try {
        const playerExists = await contract.isPlayer(walletAddress);
        if (!playerExists) {
          await contract.registerPlayer(command, command, { gasLimit: 500000 });
          setShowAlert({
            status: true,
            type: "info",
            message: `${command} is being summoned!`,
          });
          setPlayerName(command);
          setTimeout(() => setIsExistingPlayer(true), 8000);
        }
      } catch (error) {
        setErrorMessage(error);
      }
      return;
    }

    const cmd = command.toLowerCase();

    try {
      switch(cmd) {
        case '/help':
          setAdditionalOutput([
            "Available Commands:",
            "/create - Create a new battle room",
            "/show   - Display all available battle rooms",
            "/join   - Join an existing battle room",
            "",
            "Example usage:",
            "/create <battle_name>",
            "/join <battle_name>"
          ]);
          break;

        case '/show':
          try {
            const battles = await contract.getAllBattles();
            const availableBattles = battles.filter(battle => battle.battleStatus === 0);
            console.log(availableBattles);
            
            // Skip the 0th index and check remaining battles
            const displayBattles = availableBattles.slice(1);
            
            if (displayBattles.length === 0) {
              setAdditionalOutput(["No battles available. Create one using /create <battle_name>"]);
            } else {
              setAdditionalOutput([
                "Available Battles:",
                ...displayBattles.map(battle => `- ${battle.name}`)
              ]);
            }
          } catch (error) {
            setAdditionalOutput([`Error: Failed to fetch battles`]);
          }
          break;

        default:
          if (cmd.startsWith('/create ')) {
            const battleName = command.slice(8).trim();
            if (!battleName) {
              setAdditionalOutput(['Usage: /create <battle_name>']);
              return;
            }
            try {
              setBattleName(battleName);
              await contract.createBattle(battleName);
              setWaitBattle(true);
            } catch (error) {
              setAdditionalOutput([`Error: Failed to create battle`]);
            }
          }
          else if (cmd.startsWith('/join ')) {
            const battleName = command.slice(6).trim();
            if (!battleName) {
              setAdditionalOutput(['Usage: /join <battle_name>']);
              return;
            }
            try {
              const battles = await contract.getAllBattles();
              const battle = battles.find(b => b.name === battleName);
              
              if (!battle) {
                setAdditionalOutput([`Battle "${battleName}" not found`]);
                return;
              }
              if (battle.battleStatus !== 0) {
                setAdditionalOutput([`Battle "${battleName}" is already full`]);
                return;
              }

              await contract.joinBattle(battleName);
              setShowAlert({
                status: true,
                type: 'success',
                message: `Joining ${battleName}...`
              });
              setTimeout(() => navigate(`/battle/${battleName}`), 1000);
            } catch (error) {
              setAdditionalOutput([`Error: Failed to join battle`]);
            }
          }
          else {
            setAdditionalOutput([
              `Unknown command: ${command}`,
              "Type /help to see available commands"
            ]);
          }
      }
    } catch (error) {
      setAdditionalOutput([`Error: An unknown error occurred`]);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && terminalText.trim()) {
      await handleCommand(terminalText.trim());
      setTerminalText('');
    }
  };

  const handleChange = (e) => {
    setTerminalText(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);
  };

  useEffect(() => {
    const checkPlayerToken = async () => {
      if (contract && walletAddress) {
        const playerExists = await contract.isPlayer(walletAddress);
        const playerTokenExists = await contract.isPlayerToken(walletAddress);
        if (playerExists && playerTokenExists) {
          const player = await contract.getPlayer(walletAddress);
          setPlayerName(player.playerName);
          setIsExistingPlayer(true);
        }
      }
    };
    checkPlayerToken();
  }, [contract, walletAddress]);

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    <div className={`${styles.hocContainer} relative min-h-screen bg-black`}>
      {waitBattle && <GameLoad />}
      
      <div
        onMouseEnter={handleHover}
        className="absolute top-2 right-2 scale-50 z-30 animate-pulse"
      >
        <CircularText
          text="6 six 6 six 6 six 6 six "
          spinDuration={15}
          className="custom-class cursor-pointer hover:animate-glow"
        />
      </div>

      <div className="absolute left-0 top-0 w-[30%] h-full z-10">
        <div className="relative w-full h-full">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />

          {showPrompt && (
            <GameTerminal
              onCommand={handleCommand}
              welcomeMessage={!isExistingPlayer 
                ? "Identify yourself, warrior..." 
                : `Welcome back, ${playerName}. 
                Type /help to view available commands.`}
              isTyping={isTyping}
              terminalText={terminalText}
              handleChange={handleChange}
              handleKeyPress={handleKeyPress}
              additionalOutput={additionalOutput}
            />
          )}
        </div>
      </div>

      <div className="absolute right-0 top-0 w-[70%] h-full z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-20" />
        <img
          src="https://pbs.twimg.com/media/GkV_PQPX0AERaXO?format=jpg&name=large"
          alt="hero-img"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Home;
