
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Info, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Link } from "react-router-dom";
import CameraComponent from "@/components/Camera";
import TicTacToe from "@/components/TicTacToe";
import GameResult from "@/components/GameResult";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const { 
    gameState, 
    setGameState, 
    setBackgroundImage,
    gameResult,
    saveBackgroundImage
  } = useGame();

  const handleStartGame = () => {
    setGameState("capturing");
  };

  const handleImageCapture = async (imageData: string) => {
    try {
      // Save image to Supabase and get public URL
      const publicUrl = await saveBackgroundImage(imageData);
      
      if (publicUrl) {
        // Set the public URL as the background image
        setBackgroundImage(publicUrl);
        setGameState("playing");
      } else {
        // If there was an error, we can still use the image data directly
        setBackgroundImage(imageData);
        setGameState("playing");
        toast({
          title: "Warning",
          description: "Image saved locally only. Database storage failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving background image:", error);
      // Fallback to using the image data directly
      setBackgroundImage(imageData);
      setGameState("playing");
      toast({
        title: "Warning",
        description: "Image saved locally only. Database storage failed.",
        variant: "destructive",
      });
    }
  };

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
                className="w-full h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-6 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Gamepad2 className="mr-2 h-6 w-6" />
                <span className="text-lg font-medium">Play Game</span>
              </Button>
              
              <Link to="/about" className="block">
                <Button 
                  variant="outline"
                  className="w-full h-14 border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 rounded-xl backdrop-blur-sm transform hover:scale-105"
                >
                  <Info className="mr-2 h-5 w-5" />
                  <span className="text-base font-medium">About</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

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

export default Index;
