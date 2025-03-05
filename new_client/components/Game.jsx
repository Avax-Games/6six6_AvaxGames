'use client'
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import GameLobby from './GameLobby';
import GameRooms from './GameRooms';
import GameStatus from './GameStatus';
import GameBoard from './GameBoard';
import PlayerHand from './PlayerHand';

const Game = () => {
  const {
    isConnected,
    gameState,
    playerData,
    opponentData,
    battleResult,
    joinGame,
    selectCard,
    playCard,
    resetGame,
    createRoom,
    joinRoom,
  } = useGame();

  const [selectedCardId, setSelectedCardId] = useState(null);

  // Reset selected card when turn changes
  useEffect(() => {
    if (gameState.currentTurn !== 'player') {
      setSelectedCardId(null);
    }
  }, [gameState.currentTurn]);

  const handleCardSelect = (card) => {
    if (gameState.currentTurn === 'player') {
      setSelectedCardId(card.id);
      selectCard(card.id);
    }
  };

  const handlePlayCard = () => {
    if (selectedCardId) {
      playCard(selectedCardId);
      setSelectedCardId(null);
    }
  };

  // If not connected to the server yet
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Connecting to server...</div>
      </div>
    );
  }

  // If player hasn't joined the game yet
  if (!playerData.name) {
    return <GameLobby onJoinGame={joinGame} />;
  }

  // If player is in the lobby (not in a room yet)
  if (gameState.status === 'lobby') {
    return <GameRooms onCreateRoom={createRoom} onJoinRoom={joinRoom} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GameStatus 
        gameState={gameState} 
        playerStats={playerData.stats} 
        opponentStats={opponentData.stats || { hp: 0, wins: 0 }} 
      />
      
      <div className="my-8">
        <GameBoard 
          playerCard={playerData.selectedCard} 
          opponentCard={opponentData.selectedCard} 
          battleResult={battleResult} 
        />
      </div>
      
      <div className="my-8">
        <PlayerHand 
          cards={playerData.cards} 
          onCardSelect={handleCardSelect} 
          isActive={gameState.currentTurn === 'player'} 
          selectedCardId={selectedCardId} 
        />
      </div>
      
      <div className="flex justify-center gap-4 mt-8">
        {gameState.currentTurn === 'player' && selectedCardId && (
          <button 
            className="btn btn-success"
            onClick={handlePlayCard}
          >
            Play Card
          </button>
        )}
        
        {gameState.status === 'finished' && (
          <button 
            className="btn btn-primary"
            onClick={resetGame}
          >
            Play Again
          </button>
        )}
        
        <button 
          className="btn btn-secondary"
          onClick={() => window.location.reload()}
        >
          Leave Game
        </button>
      </div>
    </div>
  );
};

export default Game; 