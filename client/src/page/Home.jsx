import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CustomButton,
  CustomInput,
  CircularText,
  LetterGlitch,
} from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";

const Home = () => {
  const { contract, walletAddress, gameData, setShowAlert, setErrorMessage } =
    useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const [terminalText, setTerminalText] = useState("");
  const [showPrompt, setShowPrompt] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isExistingPlayer, setIsExistingPlayer] = useState(false);
  const navigate = useNavigate();

  const handleHover = () => {
    const timer = setTimeout(() => {
      console.log("666");
    }, 2000);

    return () => clearTimeout(timer);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && terminalText.trim()) {
      setShowPrompt(false);
      setPlayerName(terminalText);
      try {
        const playerExists = await contract.isPlayer(walletAddress);
        if (!playerExists) {
          await contract.registerPlayer(terminalText, terminalText, {
            gasLimit: 500000,
          });
          setShowAlert({
            status: true,
            type: "info",
            message: `${terminalText} is being summoned!`,
          });
          setTimeout(() => navigate("/create-battle"), 8000);
        }
      } catch (error) {
        setErrorMessage(error);
        setShowPrompt(true);
      }
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
          setIsExistingPlayer(true);
          setTerminalText("Welcome back, warrior...");
          setTimeout(() => navigate("/create-battle"), 5000);
        }
      }
    };

    checkPlayerToken();
  }, [contract, walletAddress]);

  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="terminal-container w-[80%] max-w-2xl bg-black/90 rounded-lg border border-red-500/30 p-8 font-mono">
                <div className="terminal-body text-red-500">
                  <p className="mb-4 typing-animation">[System]: Initializing player registration...</p>
                  {isExistingPlayer ? (
                    <p className="mb-4 typing-animation-2">[System]: Welcome back, warrior. Redirecting to battle...</p>
                  ) : (
                    <>
                      <p className="mb-4 typing-animation-2">[System]: Please identify yourself, warrior.</p>
                      <div className={`flex items-center gap-2 ${isTyping ? 'typing' : ''}`}>
                        <span className="text-red-500">root@avax-gods:~$</span>
                        <input
                          type="text"
                          value={terminalText}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress}
                          className="flex-1 bg-transparent border-none outline-none text-red-500"
                          autoFocus
                          disabled={isExistingPlayer}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
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
