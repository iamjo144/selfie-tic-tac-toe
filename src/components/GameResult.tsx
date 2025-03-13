import React, { useEffect, useState, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const GameResult: React.FC = () => {
  const { gameResult, resetGame, saveResultImage } = useGame();
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);
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

  const capturePhoto = async (stream: MediaStream) => {
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
        
        // Apply a semi-transparent gradient overlay based on result
        if (gameResult === "win") {
          // Golden gradient for win
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, "rgba(255, 215, 0, 0.4)");
          gradient.addColorStop(1, "rgba(218, 165, 32, 0.4)");
          ctx.fillStyle = gradient;
        } else if (gameResult === "loss") {
          // Blue-purple gradient for loss
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, "rgba(102, 51, 153, 0.4)");
          gradient.addColorStop(1, "rgba(65, 105, 225, 0.4)");
          ctx.fillStyle = gradient;
        } else {
          // Orange gradient for draw
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, "rgba(255, 165, 0, 0.4)");
          gradient.addColorStop(1, "rgba(255, 140, 0, 0.4)");
          ctx.fillStyle = gradient;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create glow effect for text
        ctx.shadowColor = gameResult === "win" 
          ? "rgba(255, 215, 0, 0.8)" 
          : gameResult === "loss" 
          ? "rgba(102, 51, 153, 0.8)" 
          : "rgba(255, 165, 0, 0.8)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Set text properties with improved styling
        const fontSize = Math.min(canvas.width, canvas.height) * 0.12;
        ctx.font = `bold ${fontSize}px 'Segoe UI', Roboto, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Add text stroke for better readability
        ctx.lineWidth = fontSize / 15;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
        
        // Apply text based on the game result with stylized look
        if (gameResult === "win") {
          // Gold text with gentle gradient for win
          const gradient = ctx.createLinearGradient(
            canvas.width / 2 - 150, 
            canvas.height / 2, 
            canvas.width / 2 + 150, 
            canvas.height / 2
          );
          gradient.addColorStop(0, "#FEF9C3");  // Light gold
          gradient.addColorStop(0.5, "#FEF08A"); // Brighter gold
          gradient.addColorStop(1, "#FDE047");   // Rich gold
          ctx.fillStyle = gradient;
          ctx.strokeText("YOU WON!", canvas.width / 2, canvas.height / 2);
          ctx.fillText("YOU WON!", canvas.width / 2, canvas.height / 2);
        } else if (gameResult === "loss") {
          // Purple-blue gradient for loss
          const gradient = ctx.createLinearGradient(
            canvas.width / 2 - 150, 
            canvas.height / 2, 
            canvas.width / 2 + 150, 
            canvas.height / 2
          );
          gradient.addColorStop(0, "#D8B4FE");  // Light purple
          gradient.addColorStop(0.5, "#C084FC"); // Medium purple
          gradient.addColorStop(1, "#A855F7");   // Deep purple
          ctx.fillStyle = gradient;
          ctx.strokeText("YOU LOST!", canvas.width / 2, canvas.height / 2);
          ctx.fillText("YOU LOST!", canvas.width / 2, canvas.height / 2);
        } else {
          // Orange gradient for draw
          const gradient = ctx.createLinearGradient(
            canvas.width / 2 - 150, 
            canvas.height / 2, 
            canvas.width / 2 + 150, 
            canvas.height / 2
          );
          gradient.addColorStop(0, "#FDBA74");  // Light orange
          gradient.addColorStop(0.5, "#FB923C"); // Medium orange
          gradient.addColorStop(1, "#F97316");   // Deep orange
          ctx.fillStyle = gradient;
          ctx.strokeText("IT'S A DRAW!", canvas.width / 2, canvas.height / 2);
          ctx.fillText("IT'S A DRAW!", canvas.width / 2, canvas.height / 2);
        }
        
        // Convert to image data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setResultImage(imageDataUrl);
        
        // Save image to database
        setSavingImage(true);
        try {
          await saveResultImage(imageDataUrl, gameResult!);
          toast({
            title: "Image Saved",
            description: "Your game result photo has been saved to the database.",
          });
        } catch (error) {
          console.error("Error saving result image:", error);
          toast({
            title: "Image Save Failed",
            description: "Failed to save your game result to the database.",
            variant: "destructive",
          });
        } finally {
          setSavingImage(false);
        }
        
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
        
        {savingImage && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white">Saving photo...</div>
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
