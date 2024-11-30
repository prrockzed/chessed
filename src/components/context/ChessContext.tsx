import { createContext, useContext, useEffect, useState } from "react";
import { TeamType } from "../../Types";

interface ChessContextProps {
  currentPlayer: TeamType;
  setCurrentPlayerByWhoseTurn: (whoseTurn: number) => void;
}

export const ChessContext = createContext<ChessContextProps>({
  currentPlayer: TeamType.RED,
  setCurrentPlayerByWhoseTurn: (whoseTurn) => {},
});

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

  const setCurrentPlayerByWhoseTurn = (whoseTurn: number) => {
    setCurrentPlayer(getCurrentPlayerByWhoseTurn(whoseTurn));
  };

  useEffect(() => {
    setCurrentPlayerByWhoseTurn(whoseTurn)
  }, [whoseTurn]);

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

export function useChessContext() {
  return useContext(ChessContext);
}
