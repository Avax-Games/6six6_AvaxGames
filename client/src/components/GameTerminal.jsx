import React, { useState, useEffect, useRef } from 'react';

const GameTerminal = ({ 
  onCommand, 
  welcomeMessage, 
  isTyping, 
  terminalText, 
  handleChange, 
  handleKeyPress,
  additionalOutput = [] 
}) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [mounted, setMounted] = useState(false);
  const terminalRef = useRef(null);
  const prevWelcomeMessage = useRef(welcomeMessage);

  // Handle initial mount animation
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, []);

  // Clear history when welcome message changes (player registration complete)
  useEffect(() => {
    if (prevWelcomeMessage.current !== welcomeMessage) {
      setTerminalHistory([]); // Clear history
      prevWelcomeMessage.current = welcomeMessage;
    }
  }, [welcomeMessage]);

  // Update terminal history when additionalOutput changes
  useEffect(() => {
    // Prevent duplicate entries
    const newOutput = additionalOutput.filter(
      output => !terminalHistory.includes(output)
    );
    
    if (newOutput.length > 0) {
      setTerminalHistory(prev => [...prev, ...newOutput]);
      
      // Scroll to bottom when new content is added
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }
  }, [additionalOutput]);

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <div className="absolute inset-0 flex items-center justify-start pl-8">
      <div className={`
        terminal-container 
        w-[80%] max-w-2xl 
        bg-black/90 
        rounded-lg 
        border border-red-500/30 
        p-8 
        font-mono
        transition-all 
        duration-500 
        ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        <div className="terminal-header mb-4 text-red-500/70 text-sm">
          [Terminal Session - {formatTimestamp()}]
        </div>
        <div className="terminal-body text-red-500">
          <div 
            ref={terminalRef}
            className="mb-4 overflow-y-auto max-h-[400px] terminal-scrollable"
          >
            {/* Welcome Message */}
            <div className="terminal-line">
              <span className="typing-animation-clean">[System]: {welcomeMessage}</span>
            </div>

            {/* Terminal History */}
            {terminalHistory.map((line, index) => (
              <div key={`${line}-${index}`} className="terminal-line mt-1">
                <span>[System]: {line}</span>
              </div>
            ))}

            {/* Input Line */}
            <div className={`terminal-input-container mt-4 ${isTyping ? 'typing' : ''}`}>
              <span className="terminal-prompt mr-1">root@6six6:~$</span>
              <div className="flex-1 relative overflow-hidden">
                <span className="font-mono text-red-500 whitespace-pre overflow-hidden">
                  {terminalText}
                  <span 
                    className={`
                      inline-block 
                      w-2.5 
                      h-5 
                      align-middle
                      bg-red-500
                      ml-[1px]
                      ${cursorVisible ? 'opacity-100' : 'opacity-0'}
                    `}
                  />
                </span>
                <input
                  type="text"
                  value={terminalText}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  className="absolute inset-0 w-full opacity-0 cursor-text"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTerminal; 