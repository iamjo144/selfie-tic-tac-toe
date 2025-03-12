
import React, { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Share2, Smile, Frown, Hand } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const GameResult: React.FC = () => {
  const { gameResult, resultImage, resetGame } = useGame();
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (gameResult === "win") {
      toast({
        title: "Victory!",
        description: "Congratulations, you won the game!",
      });
    } else if (gameResult === "loss") {
      toast({
        title: "Defeat!",
        description: "Better luck next time!",
      });
    } else if (gameResult === "draw") {
      toast({
        title: "It's a draw!",
        description: "Great minds think alike!",
      });
    }
  }, [gameResult]);

  useEffect(() => {
    if (resultImage) {
      // Process the captured image based on the game result
      const canvas = document.createElement("canvas");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Apply a semi-transparent overlay
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Set the text properties
          ctx.font = "bold 60px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Apply different effects based on the game result
          if (gameResult === "win") {
            // Yellow/gold color for win
            ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
            ctx.fillText("YOU WON!", canvas.width / 2, canvas.height / 2);
            
            // Draw a smile overlay
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 8;
            ctx.beginPath();
            const smileX = canvas.width / 2;
            const smileY = canvas.height / 3 * 2;
            const smileRadius = canvas.width / 8;
            ctx.arc(smileX, smileY, smileRadius, 0, Math.PI, false);
            ctx.stroke();
            
          } else if (gameResult === "loss") {
            // Red color for loss
            ctx.fillStyle = "rgba(220, 20, 60, 0.9)";
            ctx.fillText("YOU LOST!", canvas.width / 2, canvas.height / 2);
            
            // Draw a frown overlay
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 8;
            ctx.beginPath();
            const frownX = canvas.width / 2;
            const frownY = canvas.height / 3 * 2;
            const frownRadius = canvas.width / 8;
            ctx.arc(frownX, frownY, frownRadius, Math.PI, 2 * Math.PI, false);
            ctx.stroke();
            
          } else {
            // Orange/amber color for draw
            ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
            ctx.fillText("IT'S A DRAW!", canvas.width / 2, canvas.height / 2);
          }
          
          setProcessedImage(canvas.toDataURL("image/jpeg"));
        }
      };
      
      img.src = resultImage;
    }
  }, [resultImage, gameResult]);

  const getEmoji = () => {
    if (gameResult === "win") return <Smile className="h-12 w-12" />;
    if (gameResult === "loss") return <Frown className="h-12 w-12" />;
    return <Hand className="h-12 w-12" />;
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-scale-in">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Processed Result Image */}
        {processedImage && (
          <img 
            src={processedImage} 
            alt="Result" 
            className="w-full h-full object-cover" 
          />
        )}
      </div>
      
      <div className="flex gap-4 items-center">
        <Button
          onClick={resetGame}
          className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg transition-all hover:scale-105"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Play Again
        </Button>
        
        <Link to="/">
          <Button
            variant="outline"
            className="border-violet-200 text-violet-700 hover:bg-violet-50 px-6 py-2 rounded-xl shadow-sm transition-all hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GameResult;
