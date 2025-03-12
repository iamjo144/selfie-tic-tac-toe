
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CameraComponentProps {
  onCapture: (image: string) => void;
  onCancel?: () => void;
  facingMode?: "user" | "environment";
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  onCapture,
  onCancel,
  facingMode = "environment",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [currentFacingMode, setCurrentFacingMode] = useState<"user" | "environment">(facingMode);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    const startCamera = async () => {
      try {
        const constraints = {
          video: { 
            facingMode: currentFacingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (mounted) {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            setIsCameraReady(true);
          }
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions and try again.",
          variant: "destructive",
        });
        if (onCancel) onCancel();
      }
    };
    
    startCamera();
    
    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentFacingMode, onCancel, toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas dimensions to video aspect ratio
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL and pass to callback
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        onCapture(imageDataUrl);
        
        // Stop the camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const toggleFacingMode = () => {
    const newMode = currentFacingMode === "user" ? "environment" : "user";
    
    // Stop current stream before switching camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setCurrentFacingMode(newMode);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-scale-in">
      <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-[3/4] shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onCancel={onCancel}
          onLoadedMetadata={() => setIsCameraReady(true)}
        />
        
        {/* Canvas for capturing (hidden) */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera UI overlay */}
        <div className="absolute inset-x-0 top-4 flex justify-between px-4">
          {onCancel && (
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-black/30 border-white/20 text-white rounded-full h-10 w-10"
              onClick={onCancel}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            className="bg-black/30 border-white/20 text-white rounded-full h-10 w-10"
            onClick={toggleFacingMode}
          >
            <FlipHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <Button
            disabled={!isCameraReady}
            onClick={handleCapture}
            className="rounded-full h-16 w-16 p-0 flex items-center justify-center bg-white border-4 border-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <div className="rounded-full h-14 w-14 bg-white border-8 border-white"></div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraComponent;
