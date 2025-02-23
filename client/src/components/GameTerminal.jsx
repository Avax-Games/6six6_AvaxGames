import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Standard cursor blink rate

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e) => {
    // Prevent space at beginning
    if (e.key === ' ' && (!terminalText || terminalText.length === 0)) {
      e.preventDefault();
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-start pl-8">
      <div className="terminal-container w-[80%] max-w-2xl bg-black/90 rounded-lg border border-red-500/30 p-8 font-mono">
        <div className="terminal-body text-red-500">
          <p className="mb-4 typing-animation">[System]: {welcomeMessage}</p>
          {additionalOutput.map((output, index) => (
            <p key={index} className={`mb-4 typing-animation-${index + 2}`}>[System]: {output}</p>
          ))}
          <div className={`terminal-input-container ${isTyping ? 'typing' : ''}`}>
            <span className="terminal-prompt mr-1">root@avax-gods:~$</span>
            <div className="flex-1 relative">
              <span className="font-mono text-red-500">
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
  );
};

export default GameTerminal; 