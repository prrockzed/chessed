import './ChessWrapper.css'
import { useChessContext } from '../context/ChessContext'
import { TeamType } from '../../Types'

type PlayerState = 'active' | 'inactive' | 'lost';

/** Wrapper component for the chess board, holds player panels surrounding the board */
export default function ChessWrapper({
  children,
  loseOrder: lostTeams,
}: {
  children: React.ReactNode;
  loseOrder: TeamType[];
}) {
  const { currentPlayer } = useChessContext();
  const players = [
    { name: "Red Player", color: "red", id: "r" },
    { name: "Blue Player", color: "blue", id: "b" },
    { name: "Yellow Player", color: "yellow", id: "y" },
    { name: "Green Player", color: "green", id: "g" },
  ];

  const getPlayerState = (playerId: TeamType): PlayerState => {
    if (lostTeams.includes(playerId)) return 'lost'
    return currentPlayer === playerId ? 'active' : 'inactive'
  }

  const displayBgColor = players.find((p) => p.id === currentPlayer)?.color || 'grey';

  return (
    <div className='chess-wrapper'>
      <div className='game-display'>
        <div
          className='currentPlayerDisplay'
          style={{ backgroundColor: displayBgColor }}
        >
          {players.find((p) => p.id === currentPlayer)?.name}
        </div>
      </div>
      <div className='game-layout'>
        <div className='panel-area'>
          <PlayerPanel
            name='Yellow Player'
            color='yellow'
            playerState={getPlayerState(TeamType.YELLOW)}
          />
        </div>
        <div className='middle-panel'>
          <div className='panel-area middle-panels' id='left-panel'>
            <PlayerPanel
              name='Blue Player'
              color='blue'
              playerState={getPlayerState(TeamType.BLUE)}
            />
          </div>
          <div className='panel-area chessboard-container'>{children}</div>
          <div className='panel-area middle-panels'>
            <PlayerPanel
              name='Green Player'
              color='green'
              playerState={getPlayerState(TeamType.GREEN)}
            />
          </div>
        </div>
        <div className='panel-area'>
          <PlayerPanel
            name='Red Player'
            color='red'
            playerState={getPlayerState(TeamType.RED)}
          />
        </div>
      </div>
    </div>
  );
}

interface PlayerPanelProps {
  name: string
  color: string
  playerState: PlayerState
}

/** Player panel component, holds player name and indicates active player */
function PlayerPanel({ name, color, playerState }: PlayerPanelProps) {
  const stateToColorMap = {
    active: color,
    inactive: 'grey',
    lost: '#444',
  }

  return (
    <div
      className={`player-panel ${playerState === 'active' ? 'active' : ''}`}
      style={{ 
        backgroundColor: stateToColorMap[playerState], 
        color: playerState === 'lost' ? "#eee" : "black" 
      }}
    >
      <div className='player-name'>{`${name} ${playerState === 'lost' ? 'lost' : ''}`}</div>
    </div>
  )
}
