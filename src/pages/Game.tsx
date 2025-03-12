
import React from "react";
import { useGame } from "@/context/GameContext";
import TicTacToe from "@/components/TicTacToe";
import GameResult from "@/components/GameResult";
import CameraComponent from "@/components/Camera";

const Game = () => {
  const { 
    gameState, 
    setGameState, 
    setBackgroundImage, 
    gameResult 
  } = useGame();

  const handleImageCapture = (imageData: string) => {
    setBackgroundImage(imageData);
    setGameState("playing");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {gameState === "capturing" && (
          <CameraComponent 
            onCapture={handleImageCapture}
            facingMode="environment"
          />
        )}

        {gameState === "playing" && (
          <TicTacToe />
        )}

        {gameState === "result" && (
          <GameResult />
        )}
      </div>
    </div>
  );
};

export default Game;
