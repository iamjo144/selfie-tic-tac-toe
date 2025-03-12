
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import { GameProvider } from "./context/GameContext";
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

// Add framer-motion dependency
import("framer-motion").catch(console.error);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/game" element={<Game />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
