import "./ChessWrapper.css";
import { useChessContext } from "../context/ChessContext";
import { TeamType } from "../../Types";

/** Wrapper component for the chess board, holds player panels surrounding the board */
export default function ChessWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentPlayer } = useChessContext();
  const players = [
    { name: "Red Player", color: "red", id: "r" },
    { name: "Blue Player", color: "blue", id: "b" },
    { name: "Yellow Player", color: "yellow", id: "y" },
    { name: "Green Player", color: "green", id: "g" },
  ];

  const lostTeams: TeamType[] = [];

  const displayBgColor = players.find((p) => p.id === currentPlayer)?.color || "grey";
  const lostPlayerColor = "#eeeeee";

  return (
    <div className="chess-wrapper">
      <div className="game-display">
        <div className="currentPlayerDisplay" style={{backgroundColor: displayBgColor}}>
          {players.find((p) => p.id === currentPlayer)?.name}
        </div>
      </div>
      <div className="game-layout">
        <div className="panel-area">
          <PlayerPanel
            name="Yellow Player"
            color={ lostTeams.includes(TeamType.YELLOW) ? lostPlayerColor :  "yellow"}
            isActive={currentPlayer === "y" && !lostTeams.includes(TeamType.YELLOW)}
          />
        </div>
        <div className="middle-panel">
          <div className="panel-area middle-panels" id="left-panel">
            <PlayerPanel
              name="Blue Player"
              color={ lostTeams.includes(TeamType.BLUE) ? lostPlayerColor :  "blue"}
              isActive={currentPlayer === "b" && !lostTeams.includes(TeamType.BLUE)}
            />
          </div>
          <div className="panel-area chessboard-container">{children}</div>
          <div className="panel-area middle-panels">
            <PlayerPanel
              name="Green Player"
              color={ lostTeams.includes(TeamType.GREEN) ? lostPlayerColor :  "green"}
              isActive={currentPlayer === "g" && !lostTeams.includes(TeamType.GREEN)}
            />
          </div>
        </div>
        <div className="panel-area">
          <PlayerPanel
            name="Red Player"
            color={ lostTeams.includes(TeamType.RED) ? lostPlayerColor :  "red"}
            isActive={currentPlayer === "r" && !lostTeams.includes(TeamType.RED)}
          />
        </div>
      </div>
    </div>
  );
}

interface PlayerPanelProps {
  name: string;
  color: string;
  isActive: boolean;
}

/** Player panel component, holds player name and indicates active player */
function PlayerPanel({ name, color, isActive }: PlayerPanelProps) {
  return (
    <div
      className={`player-panel ${isActive ? "active" : ""}`}
      style={{ backgroundColor: isActive ? color : "grey" }}
    >
      <div className="player-name">{name}</div>
    </div>
  )
}
