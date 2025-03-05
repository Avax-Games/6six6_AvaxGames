import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CircularText,
  LetterGlitch,
  GameTerminal,
} from "../components";
import styles from "../styles";

// Mock data for UI display
const mockPlayerName = "CyberWarrior";
const mockBattles = [
  { name: "Neon Arena" },
  { name: "Quantum Field" },
  { name: "Digital Wasteland" }
];

const Home = () => {
  const [playerName, setPlayerName] = useState(mockPlayerName);
  const [terminalText, setTerminalText] = useState("");
  const [showPrompt, setShowPrompt] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isExistingPlayer, setIsExistingPlayer] = useState(true); // Set to true for UI demo
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
    const cmd = command.toLowerCase();

    // Handle new player registration (UI only)
    if (!isExistingPlayer) {
      setPlayerName(command);
      setAdditionalOutput([`Welcome, ${command}! Registration successful (UI Only)`]);
      setTimeout(() => setIsExistingPlayer(true), 2000);
      return;
    }

    // Handle commands for existing players
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
        setAdditionalOutput([
          "Available Battles (UI Only):",
          ...mockBattles.map(battle => `- ${battle.name}`)
        ]);
        break;

      default:
        if (cmd.startsWith('/create ')) {
          const battleName = command.slice(8).trim();
          if (!battleName) {
            setAdditionalOutput(['Usage: /create <battle_name>']);
            return;
          }
          
          setAdditionalOutput([`Creating battle "${battleName}" (UI Only)`]);
          setWaitBattle(true);
          
          // Add the new battle to mock battles for UI demo
          mockBattles.push({ name: battleName });
        }
        else if (cmd.startsWith('/join ')) {
          const battleName = command.slice(6).trim();
          if (!battleName) {
            setAdditionalOutput(['Usage: /join <battle_name>']);
            return;
          }
          
          const battle = mockBattles.find(b => b.name.toLowerCase() === battleName.toLowerCase());
          
          if (!battle) {
            setAdditionalOutput([`Battle "${battleName}" not found`]);
            return;
          }
          
          setAdditionalOutput([`Joining battle "${battleName}" (UI Only)`]);
          setTimeout(() => navigate(`/battle/${battleName}`), 1000);
        }
        else {
          setAdditionalOutput([
            `Unknown command: ${command}`,
            "Type /help to see available commands"
          ]);
        }
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

  return (
    <div className={`${styles.hocContainer} relative min-h-screen bg-black`}>
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
