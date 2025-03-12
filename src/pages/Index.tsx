
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {gameState === "initial" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Selfie Tic-Tac-Toe
            </h1>
            <p className="text-gray-600 mb-10">Take a photo and play on your custom background!</p>
            
            <div className="space-y-4">
              <Button 
                onClick={handleStartGame}
                className="w-full btn-hover bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white px-6 py-6 rounded-xl shadow-lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Play Game
              </Button>
              
              <Link to="/about">
                <Button 
                  variant="outline"
                  className="w-full border-violet-200 text-violet-700 hover:bg-violet-50"
                >
                  <Info className="mr-2 h-4 w-4" />
                  About
                </Button>
              </Link>
            </div>
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
