
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            About
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Aman Joshi</h2>
            <a 
              href="https://www.linkedin.com/in/joamen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-2 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="text-sm">www.linkedin.com/in/joamen</span>
            </a>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl">
            <h3 className="font-medium text-purple-800 mb-2">About the Game</h3>
            <p className="text-gray-700">
              Take a photo and play Tic-Tac-Toe on your custom background! The game captures your reaction when you win or lose.
            </p>
          </div>
          
          <div className="p-4 bg-pink-50 rounded-xl">
            <h3 className="font-medium text-pink-800 mb-2">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Tap Play to start</li>
              <li>Take a photo for the game background</li>
              <li>Play Tic-Tac-Toe against the computer</li>
              <li>Get your reaction captured when the game ends</li>
              <li>See your photo edited based on the result</li>
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
