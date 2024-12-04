import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TeamType } from "../../Types";

interface ChessContextProps {
  currentPlayer: TeamType;
  setCurrentPlayerByWhoseTurn: (whoseTurn: number) => void;
}

export const ChessContext = createContext<ChessContextProps>({
  currentPlayer: TeamType.RED,
  setCurrentPlayerByWhoseTurn: (whoseTurn) => {},
});

/** Provider component for the chess context, provides currentPlayer, interactionMode */
export function ChessProvider({ whoseTurn, children }: { whoseTurn: number, children: React.ReactNode }) {
  const getCurrentPlayerByWhoseTurn = (whoseTurn: number): TeamType => {
    const playerID: number = whoseTurn % 4;
    switch (playerID) {
      case 0:
        return TeamType.GREEN;
      case 1:
        return TeamType.RED;
      case 2:
        return TeamType.BLUE;
      case 3:
        return TeamType.YELLOW;
      default:
        return TeamType.RED;
    }
  };

  const [currentPlayer, setCurrentPlayer] = useState<TeamType>(
    getCurrentPlayerByWhoseTurn(whoseTurn)
  );

  /** memoized function to set the current player by whose turn as input */
  // fixes the function behavior, function doesnt change on re-render, only changes when input differs
  const setCurrentPlayerByWhoseTurn = useCallback((whoseTurn: number) => {
    setCurrentPlayer(getCurrentPlayerByWhoseTurn(whoseTurn));
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
