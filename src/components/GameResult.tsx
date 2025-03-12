
import React, { useEffect, useState, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const GameResult: React.FC = () => {
  const { gameResult, resetGame } = useGame();
  const [resultImage, setResultImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (gameResult) {
      toast({
        title: gameResult === "win" ? "Victory!" : gameResult === "loss" ? "Defeat!" : "Draw!",
        description: gameResult === "win" 
          ? "Congratulations, you won the game!" 
          : gameResult === "loss" 
          ? "Better luck next time!" 
          : "Great minds think alike!",
      });
      
      // Start camera to take selfie automatically
      startCamera();
    }
  }, [gameResult]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          // Take a photo after a short delay
          setTimeout(() => {
            capturePhoto(stream);
          }, 1000);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera for result photo.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = (stream: MediaStream) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas dimensions to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Apply a semi-transparent overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set the text properties
        ctx.font = "bold 60px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Apply text based on the game result
        if (gameResult === "win") {
          // Yellow/gold color for win
          ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
          ctx.fillText("YOU WON!", canvas.width / 2, canvas.height / 2);
        } else if (gameResult === "loss") {
          // Red color for loss
          ctx.fillStyle = "rgba(220, 20, 60, 0.9)";
          ctx.fillText("YOU LOST!", canvas.width / 2, canvas.height / 2);
        } else {
          // Orange/amber color for draw
          ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
          ctx.fillText("IT'S A DRAW!", canvas.width / 2, canvas.height / 2);
        }
        
        // Convert to image data URL and set state
        setResultImage(canvas.toDataURL("image/jpeg"));
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-scale-in">
      {/* Hidden video element for capturing */}
      <video 
        ref={videoRef} 
        className="hidden"
        playsInline 
        muted
      />
      
      {/* Hidden canvas for processing */}
      <canvas 
        ref={canvasRef} 
        className="hidden" 
      />
      
      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Result Image */}
        {resultImage ? (
          <img 
            src={resultImage} 
            alt="Result" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Processing result...</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-4 items-center w-full">
        <Button
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
        
        <Link to="/" className="w-full">
          <Button
            variant="outline"
            className="w-full border-violet-200 text-violet-700 hover:bg-violet-50 px-6 py-3 rounded-xl shadow-sm transition-all hover:scale-105"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GameResult;
