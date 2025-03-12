
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import CameraComponent from "@/components/Camera";
import TicTacToe from "@/components/TicTacToe";
import GameResult from "@/components/GameResult";

const Index = () => {
  const { 
    gameState, 
    setGameState, 
    setBackgroundImage, 
    setResultImage, 
    gameResult
  } = useGame();

  const handleStartGame = () => {
    setGameState("capturing");
  };

  const handleImageCapture = (imageData: string) => {
    setBackgroundImage(imageData);
    setGameState("playing");
  };

  const handleResultCapture = (imageData: string) => {
    setResultImage(imageData);
  };

  useEffect(() => {
    if (gameState === "result" && gameResult) {
      // When game is over, we need to capture a selfie for the result screen
      setGameState("capturing");
    }
  }, [gameResult, gameState, setGameState]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {gameState === "initial" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Selfie Tic-Tac-Toe</h1>
            <p className="text-gray-600 mb-8">Take a photo and play on your custom background!</p>
            
            <Button 
              onClick={handleStartGame}
              className="btn-hover bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md"
            >
              <Camera className="mr-2 h-5 w-5" />
              Start Camera
            </Button>
          </motion.div>
        )}

        {gameState === "capturing" && !gameResult && (
          <CameraComponent 
            onCapture={handleImageCapture}
            facingMode="environment"
          />
        )}

        {gameState === "capturing" && gameResult && (
          <CameraComponent 
            onCapture={handleResultCapture}
            facingMode="user"
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

export default Index;
