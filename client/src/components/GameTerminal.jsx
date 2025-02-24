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
  const [commandHistory, setCommandHistory] = useState([]);
  const terminalRef = useRef(null);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Handle terminal input
  const handleTerminalInput = (e) => {
    if (e.key === 'Enter' && terminalText.trim()) {
      setCommandHistory(prev => [...prev, { 
        type: 'command', 
        content: terminalText.trim() 
      }]);
      
      handleKeyPress(e);

      // Scroll to bottom after command
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
    } else {
      handleKeyPress(e);
    }
  };

  // Handle additional output and auto-scroll
  useEffect(() => {
    if (additionalOutput?.length > 0) {
      setCommandHistory(prev => [...prev, { 
        type: 'output', 
        content: additionalOutput 
      }]);

      // Scroll to bottom after output
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [additionalOutput]);

  // Initial scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-start pl-8">
      <div className="w-[80%] max-w-3xl bg-black/90 rounded-lg border border-red-500/30 p-6 font-mono">
        {/* Terminal Header */}
        <div className="text-red-500/70 text-sm pb-4 border-b border-red-500/20">
          [Terminal Session - {new Date().toLocaleTimeString()}]
        </div>

        {/* Terminal Content Area */}
        <div 
          ref={terminalRef}
          className="mt-4 h-[60vh] overflow-y-auto scrollbar-hide"
          style={{
            msOverflowStyle: 'none',  /* IE and Edge */
            scrollbarWidth: 'none',   /* Firefox */
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Welcome Message */}
          <div className="flex">
            <span className="text-red-500 w-[120px]">[System]: </span>
            <span className="text-red-300">{welcomeMessage}</span>
          </div>

          {/* Command History */}
          <div className="space-y-2 mt-4">
            {commandHistory.map((entry, index) => (
              <div key={index}>
                {entry.type === 'command' && (
                  <div className="flex">
                    <span className="text-red-500 w-[120px]">root@6six6:~$</span>
                    <span className="text-red-400">{entry.content}</span>
                  </div>
                )}
                {entry.type === 'output' && (
                  <div className="flex">
                    <span className="text-red-500 w-[120px]">[System]: </span>
                    <div className="text-red-300 whitespace-pre-line">
                      {entry.content.join('\n')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Line */}
          <div className="flex items-center mt-4">
            <span className="text-red-500 w-[120px]">root@6six6:~$</span>
            <div className="flex-1 relative">
              <span className="text-red-400">
                {terminalText}
                <span 
                  className={`
                    inline-block 
                    w-2.5 
                    h-5 
                    bg-red-500
                    ml-0.5
                    align-middle
                    ${cursorVisible ? 'opacity-100' : 'opacity-0'}
                    transition-opacity duration-100
                  `}
                />
              </span>
              <input
                type="text"
                value={terminalText}
                onChange={handleChange}
                onKeyPress={handleTerminalInput}
                className="absolute inset-0 w-full opacity-0 cursor-text outline-none bg-transparent"
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