import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TeamType } from "../../Types";

interface ChessContextProps {
  currentPlayer: TeamType;
  setCurrentPlayerByWhoseTurn: (whoseTurn: TeamType) => void;
}

export const ChessContext = createContext<ChessContextProps>({
  currentPlayer: TeamType.RED,
  setCurrentPlayerByWhoseTurn: (whoseTurn) => {},
});

/** Provider component for the chess context, provides currentPlayer, interactionMode */
export function ChessProvider({ whoseTurn, children }: { whoseTurn: TeamType, children: React.ReactNode }) {
  const [currentPlayer, setCurrentPlayer] = useState<TeamType>(whoseTurn);

  /** memoized function to set the current player by whose turn as input */
  // fixes the function behavior, function doesnt change on re-render, only changes when input differs
  const setCurrentPlayerByWhoseTurn = useCallback((whoseTurn: TeamType) => {
    setCurrentPlayer(whoseTurn);
  }, []);  

  useEffect(() => {
    setCurrentPlayerByWhoseTurn(whoseTurn)
  }, [whoseTurn, setCurrentPlayerByWhoseTurn]);

  return (
    <ChessContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayerByWhoseTurn,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
}

/** custom chess context hook, provides easy access to the chess context */
export function useChessContext() {
  return useContext(ChessContext);
}
