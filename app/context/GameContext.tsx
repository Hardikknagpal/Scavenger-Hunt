import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Question {
  img_src: string;
  'Age group': string[];
  question: string;
  responseType: string;
  choices: string[];
  hint: string;
  Answer: string[];
  pointsRewarded: number[];
}

interface SubmitAnswerResponse {
  isCorrect: boolean;
  coordinates?: string;
  locationName?: string;
  nextClue?: string;
  pointsAwarded?: number;
  message?: string;
  hintsRemaining?: number;
}

interface GameContextType {
  score: number;
  level: number;
  currentQuestion: Question | null;
  selectedAnswer: string;
  scannedEndpoint: string;
  lastResponse: SubmitAnswerResponse | null;
  setScore: (score: number) => void;
  setLevel: (level: number) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setSelectedAnswer: (answer: string) => void;
  setScannedEndpoint: (endpoint: string) => void;
  setLastResponse: (response: SubmitAnswerResponse | null) => void;
  addScore: (points: number) => void;
  nextLevel: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [scannedEndpoint, setScannedEndpoint] = useState('');
  const [lastResponse, setLastResponse] = useState<SubmitAnswerResponse | null>(null);

  const addScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setCurrentQuestion(null);
    setSelectedAnswer('');
    setScannedEndpoint('');
    setLastResponse(null);
  };

  return (
    <GameContext.Provider
      value={{
        score,
        level,
        currentQuestion,
        selectedAnswer,
        scannedEndpoint,
        lastResponse,
        setScore,
        setLevel,
        setCurrentQuestion,
        setSelectedAnswer,
        setScannedEndpoint,
        setLastResponse,
        addScore,
        nextLevel,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export type { Question, SubmitAnswerResponse };
