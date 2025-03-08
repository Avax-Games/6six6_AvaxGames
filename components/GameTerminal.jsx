import React, { useState, useEffect, useRef } from 'react';

const GameTerminal = ({ 
  welcomeMessage, 
  terminalText, 
  handleChange, 
  handleKeyPress,
  additionalOutput = [] 
}) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [commandHistory, setCommandHistory] = useState([]);
  const [sessionTime, setSessionTime] = useState('');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize session time on client-side only
  useEffect(() => {
    setSessionTime(new Date().toLocaleTimeString());
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  // Handle input and scroll
  const handleInput = (e) => {
    if (e.key === 'Enter' && terminalText.trim()) {
      setCommandHistory(prev => [...prev, { type: 'command', content: terminalText.trim() }]);
      handleKeyPress(e);
      scrollToBottom();
    } else {
      handleKeyPress(e);
    }
  };

  // Handle output
  useEffect(() => {
    if (additionalOutput?.length > 0) {
      setCommandHistory(prev => [...prev, { type: 'output', content: additionalOutput }]);
      scrollToBottom();
    }
  }, [additionalOutput]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 50);
  };

  // Focus input when clicking anywhere in terminal
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full h-full max-w-3xl mx-auto">
      <div 
        className="bg-black/90 rounded-lg border border-red-500/30 p-4 md:p-6 font-mono cursor-text shadow-lg shadow-red-500/10 h-full flex flex-col"
        onClick={handleTerminalClick}
      >
        <div className="text-red-500/70 text-sm pb-4 border-b border-red-500/20">
          [Terminal Session - {sessionTime}]
        </div>

        <div 
          ref={terminalRef}
          className="mt-4 flex-grow overflow-y-auto scrollbar-hide"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <span className="text-red-500 flex-shrink-0">[System]: </span>
            <span className="text-red-300">{welcomeMessage}</span>
          </div>

          <div className="space-y-2 mt-4">
            {commandHistory.map((entry, index) => (
              <div key={index}>
                {entry.type === 'command' ? (
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-red-500 flex-shrink-0">root@6six6:~$&nbsp;</span>
                    <span className="text-red-400 break-words">{entry.content}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-red-500 flex-shrink-0">[System]: </span>
                    <div className="text-red-300 break-words whitespace-pre-line">
                      {entry.content.join('\n')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-4 mt-4 items-center">
            <span className="text-red-500 flex-shrink-0">root@6six6:~$&nbsp;</span>
            <div className="relative">
              <span className="text-red-400">
                {terminalText}
                <span className={`inline-block w-2.5 h-5 bg-red-500 ml-0.5 align-middle 
                  ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
                />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={terminalText}
                onChange={handleChange}
                onKeyPress={handleInput}
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