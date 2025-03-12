
import React, { createContext, useContext, useState, ReactNode } from "react";

type GameState = "initial" | "capturing" | "playing" | "result";
type Player = "X" | "O";
type BoardState = (Player | null)[][];
type GameResult = "win" | "loss" | "draw" | null;

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
  resultImage: string | null;
  setResultImage: (image: string | null) => void;
  currentPlayer: Player;
  setCurrentPlayer: (player: Player) => void;
  board: BoardState;
  setBoard: (board: BoardState) => void;
  resetBoard: () => void;
  winner: Player | null;
  setWinner: (winner: Player | null) => void;
  gameResult: GameResult;
  setGameResult: (result: GameResult) => void;
  makeMove: (row: number, col: number) => void;
  resetGame: () => void;
  playerSymbol: Player;
}

const initialBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>("initial");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [board, setBoard] = useState<BoardState>(JSON.parse(JSON.stringify(initialBoard)));
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const playerSymbol: Player = "X"; // Player is always X, computer is O
  
  const resetBoard = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setCurrentPlayer("X");
    setWinner(null);
    setGameResult(null);
  };
  
  const resetGame = () => {
    resetBoard();
    setGameState("initial");
    setBackgroundImage(null);
    setResultImage(null);
  };
  
  const checkWinner = (boardState: BoardState): Player | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        boardState[i][0] !== null &&
        boardState[i][0] === boardState[i][1] &&
        boardState[i][1] === boardState[i][2]
      ) {
        return boardState[i][0];
      }
    }
    
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        boardState[0][i] !== null &&
        boardState[0][i] === boardState[1][i] &&
        boardState[1][i] === boardState[2][i]
      ) {
        return boardState[0][i];
      }
    }
    
    // Check diagonals
    if (
      boardState[0][0] !== null &&
      boardState[0][0] === boardState[1][1] &&
      boardState[1][1] === boardState[2][2]
    ) {
      return boardState[0][0];
    }
    
    if (
      boardState[0][2] !== null &&
      boardState[0][2] === boardState[1][1] &&
      boardState[1][1] === boardState[2][0]
    ) {
      return boardState[0][2];
    }
    
    return null;
  };
  
  const isBoardFull = (boardState: BoardState): boolean => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardState[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  };
  
  const findBestMove = (boardState: BoardState): { row: number; col: number } => {
    let bestVal = -Infinity;
    let bestMove = { row: -1, col: -1 };
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardState[i][j] === null) {
          // Make the move
          boardState[i][j] = "O";
          
          // Compute evaluation function for this move
          const moveVal = minimax(boardState, 0, false);
          
          // Undo the move
          boardState[i][j] = null;
          
          if (moveVal > bestVal) {
            bestMove.row = i;
            bestMove.col = j;
            bestVal = moveVal;
          }
        }
      }
    }
    
    return bestMove;
  };
  
  const minimax = (boardState: BoardState, depth: number, isMax: boolean): number => {
    const winnerPlayer = checkWinner(boardState);
    
    if (winnerPlayer === "O") return 10 - depth;
    if (winnerPlayer === "X") return depth - 10;
    if (isBoardFull(boardState)) return 0;
    
    if (isMax) {
      let best = -Infinity;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boardState[i][j] === null) {
            boardState[i][j] = "O";
            best = Math.max(best, minimax(boardState, depth + 1, !isMax));
            boardState[i][j] = null;
          }
        }
      }
      
      return best;
    } else {
      let best = Infinity;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boardState[i][j] === null) {
            boardState[i][j] = "X";
            best = Math.min(best, minimax(boardState, depth + 1, !isMax));
            boardState[i][j] = null;
          }
        }
      }
      
      return best;
    }
  };
  
  const makeComputerMove = () => {
    const boardCopy = JSON.parse(JSON.stringify(board));
    const { row, col } = findBestMove(boardCopy);
    
    if (row !== -1 && col !== -1) {
      const newBoard = [...board];
      newBoard[row][col] = "O";
      setBoard(newBoard);
      setCurrentPlayer("X");
      
      const computerWinner = checkWinner(newBoard);
      if (computerWinner) {
        setWinner(computerWinner);
        setGameResult(computerWinner === playerSymbol ? "win" : "loss");
        setGameState("result");
      } else if (isBoardFull(newBoard)) {
        setGameResult("draw");
        setGameState("result");
      }
    }
  };
  
  const makeMove = (row: number, col: number) => {
    if (board[row][col] !== null || currentPlayer !== playerSymbol || winner) return;
    
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    const playerWinner = checkWinner(newBoard);
    if (playerWinner) {
      setWinner(playerWinner);
      setGameResult(playerWinner === playerSymbol ? "win" : "loss");
      setGameState("result");
      return;
    }
    
    if (isBoardFull(newBoard)) {
      setGameResult("draw");
      setGameState("result");
      return;
    }
    
    setCurrentPlayer("O");
    
    // Add a small delay before computer makes a move
    setTimeout(() => {
      makeComputerMove();
    }, 500);
  };
  
  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        backgroundImage,
        setBackgroundImage,
        resultImage,
        setResultImage,
        currentPlayer,
        setCurrentPlayer,
        board,
        setBoard,
        resetBoard,
        winner,
        setWinner,
        gameResult,
        setGameResult,
        makeMove,
        resetGame,
        playerSymbol,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
