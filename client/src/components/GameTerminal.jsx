import React, { useState } from 'react';

const GameTerminal = ({ 
  onCommand, 
  welcomeMessage, 
  isTyping, 
  terminalText, 
  handleChange, 
  handleKeyPress,
  additionalOutput = [] 
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="terminal-container w-[80%] max-w-2xl bg-black/90 rounded-lg border border-red-500/30 p-8 font-mono">
        <div className="terminal-body text-red-500">
          <p className="mb-4 typing-animation">[System]: {welcomeMessage}</p>
          {additionalOutput.map((output, index) => (
            <p key={index} className={`mb-4 typing-animation-${index + 2}`}>[System]: {output}</p>
          ))}
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
  );
};

export default GameTerminal; 