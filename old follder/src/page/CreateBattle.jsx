import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { useGlobalContext } from '../context';
import { GameLoad, LetterGlitch } from '../components';

const CreateBattle = () => {
  const { contract, gameData, setBattleName, setErrorMessage } = useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [availableBattles, setAvailableBattles] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);
  const navigate = useNavigate();

  const handleCommand = async (command) => {
    const parts = command.split(' ');
    const action = parts[0].toLowerCase();
    const battleName = parts.slice(1).join(' ');

    switch(action) {
      case '/create':
        if (!battleName) {
          setErrorMessage('Please provide a battle name');
          return;
        }
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
          setAvailableBattles(battles.filter(battle => battle.battleStatus === 0));
        } catch (error) {
          setErrorMessage(error);
        }
        break;

      case '/join':
        if (!battleName) {
          setErrorMessage('Please provide a battle name');
          return;
        }
        try {
          // Check if battle exists
          const battles = await contract.getAllBattles();
          const battle = battles.find(b => b.name === battleName);
          
          if (!battle) {
            setErrorMessage(`Battle "${battleName}" not found`);
            return;
          }
          if (battle.battleStatus !== 0) {
            setErrorMessage(`Battle "${battleName}" is already full`);
            return;
          }

          // Join the battle
          await contract.joinBattle(battleName);
          
          setShowAlert({
            status: true,
            type: 'success',
            message: `Joining ${battleName}...`
          });

          setTimeout(() => {
            navigate(`/battle/${battleName}`);
          }, 1000);

        } catch (error) {
          setErrorMessage(error);
        }
        break;

      default:
        setErrorMessage('Unknown command. Available commands: /create, /show, /join');
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
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    <div className={`${styles.hocContainer} relative min-h-screen bg-black`}>
      {waitBattle && <GameLoad />}

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
                  <p className="mb-4 typing-animation">[System]: Battle System Initialized</p>
                  <p className="mb-4 typing-animation-2">[System]: Available commands:</p>
                  <p className="mb-2 typing-animation-3">[System]: /create &lt;battle_name&gt; - Create a new battle</p>
                  <p className="mb-2 typing-animation-3">[System]: /show - Show available battles</p>
                  <p className="mb-4 typing-animation-3">[System]: /join &lt;battle_name&gt; - Join an existing battle</p>
                  
                  {availableBattles.length > 0 && (
                    <>
                      <p className="mb-2 typing-animation-4">[System]: Available Battles:</p>
                      {availableBattles.map((battle, index) => (
                        <p key={battle.name} className={`mb-1 typing-animation-${index + 5}`}>
                          [System]: - {battle.name}
                        </p>
                      ))}
                    </>
                  )}

                  <div className={`flex items-center gap-2 ${isTyping ? 'typing' : ''}`}>
                    <span className="text-red-500">root@avax-gods:~$</span>
                    <input
                      type="text"
                      value={terminalText}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-transparent border-none outline-none text-red-500"
                      autoFocus
                    />
                  </div>
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

export default CreateBattle;
