
import React, { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const GameResult: React.FC = () => {
  const { gameResult, resultImage, resetGame } = useGame();
  
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
  
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-scale-in">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
        {/* Result Image */}
        {resultImage && (
          <div className="absolute inset-0">
            <img 
              src={resultImage} 
              alt="Result" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          </div>
        )}
        
        {/* Result Message */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-4xl font-bold mb-4 text-white text-shadow">
              {gameResult === "win" && "You Won!"}
              {gameResult === "loss" && "You Lost!"}
              {gameResult === "draw" && "It's a Draw!"}
            </div>
            
            <Button
              onClick={resetGame}
              className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 mt-6"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
