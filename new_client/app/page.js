'use client'

import { GameProvider } from '../context/GameContext';
import Game from '../components/Game';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Card Battle Arena
          </h1>
          <p className="text-gray-400">
            A strategic card game powered by Web3 technology
          </p>
        </header>
        
        <GameProvider>
          <Game />
        </GameProvider>
      </div>
    </main>
  );
}
