import "./ChessWrapper.css";
import { useChessContext } from "../context/ChessContext";

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

  return (
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
  );
}

interface PlayerPanelProps {
  name: string;
  color: string;
  isActive: boolean;
}

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
