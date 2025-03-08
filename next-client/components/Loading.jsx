import React from 'react';
import { LetterGlitch } from './index';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Background glitch effect */}
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Cyberpunk loading text */}
        <div className="text-5xl font-bold mb-6 relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 
                         animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]">
            LOADING
          </span>
          <span className="absolute -inset-1 text-red-500 opacity-30 blur-sm animate-pulse">LOADING</span>
        </div>
        
        {/* Cyberpunk progress bar */}
        <div className="w-80 h-3 bg-black/60 rounded-sm overflow-hidden border border-red-500/50 relative">
          <div className="h-full bg-gradient-to-r from-red-600 via-green-500 to-red-600 animate-cyberpunk-progress"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer"></div>
        </div>
        
        {/* Cyberpunk decorative elements */}
        <div className="mt-6 text-green-400/70 font-mono text-sm animate-pulse">
          INITIALIZING NEURAL INTERFACE...
        </div>
        <div className="mt-2 text-white/50 font-mono text-xs flex gap-4">
          <span className="animate-blink">[PLAYER:READY]</span>
          <span className="animate-typing overflow-hidden whitespace-nowrap">BATTLE SEQUENCE LOADING...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading; 