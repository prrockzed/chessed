import "./ChessWrapper.css";
import { useChessContext } from "../context/ChessContext";

/** Wrapper component for the chess board, holds player panels surrounding the board */
export default function ChessWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentPlayer } = useChessContext();
  const {interactionMode, setInteractionMode} = useChessContext();

  const players = [
    { name: "Red Player", color: "red", id: "r" },
    { name: "Blue Player", color: "blue", id: "b" },
    { name: "Yellow Player", color: "yellow", id: "y" },
    { name: "Green Player", color: "green", id: "g" },
  ];

  const displayBgColor = players.find((p) => p.id === currentPlayer)?.color || "grey";

  return (
    <div className="chess-wrapper">
      <div className="game-display">
        <div className="currentPlayerDisplay" style={{backgroundColor: displayBgColor}}>
          {players.find((p) => p.id === currentPlayer)?.name}
        </div>
        <div className="interactionModeToggleDiv">
          <button
            className="interactionModeToggleBtn"
            onClick={() => setInteractionMode(interactionMode === "drag" ? "select" : "drag")}
          >{interactionMode === "drag" ? "Select" : "Drag"}</button>
        </div>
      </div>
      <div className="game-layout">
        <div className="panel-area">
          <PlayerPanel
            name="Yellow Player"
            color="yellow"
            isActive={currentPlayer === "y"}
          />
        </div>
        <div className="middle-panel">
          <div className="panel-area middle-panels" id="left-panel">
            <PlayerPanel
              name="Blue Player"
              color="blue"
              isActive={currentPlayer === "b"}
            />
          </div>
          <div className="panel-area chessboard-container">{children}</div>
          <div className="panel-area middle-panels">
            <PlayerPanel
              name="Green Player"
              color="green"
              isActive={currentPlayer === "g"}
            />
          </div>
        </div>
        <div className="panel-area">
          <PlayerPanel
            name="Red Player"
            color="red"
            isActive={currentPlayer === "r"}
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
