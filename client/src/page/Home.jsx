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

  const commandHelp = {
    help: {
      description: "Show available commands or get detailed help for a specific command",
      usage: "/help [command]",
      examples: [
        "/help - List all available commands",
        "/help create - Show detailed help for create command"
      ]
    },
    create: {
      description: "Create a new battle room",
      usage: "/create <battle_name>",
      examples: [
        "/create dragon_lair",
        "/create mystic_arena"
      ]
    },
    show: {
      description: "Display all available battle rooms",
      usage: "/show",
      examples: [
        "/show"
      ]
    },
    join: {
      description: "Join an existing battle room",
      usage: "/join <battle_name>",
      examples: [
        "/join dragon_lair"
      ]
    }
  };

  const handleHover = () => {
    const timer = setTimeout(() => {
      console.log("666");
    }, 2000);

    return () => clearTimeout(timer);
  };

  const handleCommand = async (command) => {
    if (!isExistingPlayer) {
      // Handle player registration
      try {
        const playerExists = await contract.isPlayer(walletAddress);
        if (!playerExists) {
          await contract.registerPlayer(command, command, {
            gasLimit: 500000,
          });
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

    const parts = command.split(' ');
    const action = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch(action) {
      case '/help':
        if (args.length === 0) {
          // Show all available commands
          return setAdditionalOutput([
            "Available commands:",
            ...Object.keys(commandHelp).map(cmd => `/${cmd} - ${commandHelp[cmd].description}`),
            "",
            "Type /help <command> for detailed usage"
          ]);
        } else {
          // Show detailed help for specific command
          const requestedCmd = args[0].replace('/', '');
          const helpInfo = commandHelp[requestedCmd];
          
          if (!helpInfo) {
            setErrorMessage(`Unknown command: ${requestedCmd}`);
            return;
          }

          return setAdditionalOutput([
            `Command: /${requestedCmd}`,
            `Description: ${helpInfo.description}`,
            `Usage: ${helpInfo.usage}`,
            "Examples:",
            ...helpInfo.examples
          ]);
        }

      case '/create':
        if (args.length === 0) {
          setErrorMessage('Usage: /create <battle_name>');
          return;
        }
        const battleName = args.join(' ');
        try {
          setBattleName(battleName);
          await contract.createBattle(battleName);
          setWaitBattle(true);
        } catch (error) {
          setErrorMessage(error);
        }
        break;

      case '/show':
        try {
          const battles = await contract.getAllBattles();
          const availableBattles = battles.filter(battle => battle.battleStatus === 0);
          
          if (availableBattles.length === 0) {
            setAdditionalOutput(["No battles available. Create one using /create <battle_name>"]);
          } else {
            setAdditionalOutput([
              "Available Battles:",
              ...availableBattles.map(battle => `- ${battle.name}`)
            ]);
          }
        } catch (error) {
          setErrorMessage(error);
        }
        break;

      case '/join':
        if (args.length === 0) {
          setErrorMessage('Usage: /join <battle_name>');
          return;
        }
        const joinBattleName = args.join(' ');
        try {
          const battles = await contract.getAllBattles();
          const battle = battles.find(b => b.name === joinBattleName);
          
          if (!battle) {
            setErrorMessage(`Battle "${joinBattleName}" not found`);
            return;
          }
          if (battle.battleStatus !== 0) {
            setErrorMessage(`Battle "${joinBattleName}" is already full`);
            return;
          }

          await contract.joinBattle(joinBattleName);
          
          setShowAlert({
            status: true,
            type: 'success',
            message: `Joining ${joinBattleName}...`
          });

          setTimeout(() => {
            navigate(`/battle/${joinBattleName}`);
          }, 1000);

        } catch (error) {
          setErrorMessage(error);
        }
        break;

      default:
        setErrorMessage('Unknown command. Type /help to see available commands');
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
          // Get player name from contract
          const player = await contract.getPlayer(walletAddress);
          console.log(player);
          setPlayerName(player.playerName); // Set the player name
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
                ? "Initializing player registration..." 
                : `Welcome back, ${playerName}.\nType /help to view available commands.`}
              isTyping={isTyping}
              terminalText={terminalText}
              handleChange={handleChange}
              handleKeyPress={handleKeyPress}
              additionalOutput={!isExistingPlayer ? ["Identify yourself, warrior."] : []}
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
