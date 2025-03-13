
import React from "react";
import { useGame } from "@/context/GameContext";
import TicTacToe from "@/components/TicTacToe";
import GameResult from "@/components/GameResult";
import CameraComponent from "@/components/Camera";
import { toast } from "@/components/ui/use-toast";

const Game = () => {
  const { 
    gameState, 
    setGameState, 
    setBackgroundImage, 
    gameResult,
    saveBackgroundImage 
  } = useGame();

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
