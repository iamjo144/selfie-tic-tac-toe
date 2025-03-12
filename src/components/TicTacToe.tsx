
import React from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TicTacToe: React.FC = () => {
  const { board, makeMove, currentPlayer, playerSymbol, backgroundImage, resetBoard } = useGame();
  
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-scale-in">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
        {/* Background Image */}
        {backgroundImage && (
          <motion.div 
            initial={{ filter: "blur(10px)" }}
            animate={{ filter: "blur(2px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img 
              src={backgroundImage} 
              alt="Background" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </motion.div>
        )}
        
        {/* Game Header */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center">
          <div className="text-white bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            <span className="mr-1">Player:</span>
            <span className="font-bold text-violet-300">X</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetBoard}
            className="bg-black/40 backdrop-blur-sm border-white/20 text-white rounded-full px-3 h-8"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Reset</span>
          </Button>
        </div>
        
        {/* Game Board */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="game-grid">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => makeMove(rowIndex, colIndex)}
                  disabled={cell !== null || currentPlayer !== playerSymbol}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: rowIndex * 0.1 + colIndex * 0.1 
                  }}
                  className={cn(
                    "game-btn bg-white/20 backdrop-blur-md rounded-md border border-white/30 shadow-sm transform transition-all duration-200",
                    cell === null && currentPlayer === playerSymbol 
                      ? "hover:bg-white/30 hover:scale-105" 
                      : "",
                    cell === "X" ? "text-violet-400" : "",
                    cell === "O" ? "text-pink-400" : ""
                  )}
                >
                  {cell}
                </motion.button>
              ))
            )}
          </div>
        </div>
        
        {/* Current Player Indicator */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center">
          <div className={cn(
            "px-4 py-2 rounded-full text-white bg-black/50 backdrop-blur-sm",
            currentPlayer === playerSymbol ? "animate-pulse-subtle" : ""
          )}>
            {currentPlayer === playerSymbol 
              ? "Your turn" 
              : "Computer is thinking..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
