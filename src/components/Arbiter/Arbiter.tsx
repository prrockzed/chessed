import { Board } from '../../models/Board'
import Chessboard from '../Chessboard/Chessboard'
import { initialBoard } from '../../Constants'
import { PieceType, TeamType } from '../../Types'
import { Piece, Position } from '../../models'
import { useRef, useState } from 'react'
import { ChessProvider } from '../context/ChessContext'
import ChessWrapper from '../ChessWrapper/ChessWrapper'

export default function Arbiter() {
  // Declaring the constants
  const [board, setBoard] = useState<Board>(initialBoard.clone())
  const [promotionPawn, setPromotionPawn] = useState<Piece>()
  const modalRef = useRef<HTMLDivElement>(null)
  const checkmateModalRef = useRef<HTMLDivElement>(null)

  // Checks for production/development
  const basePath = window.location.hostname === 'localhost' ? '/chessed' : ''

  // Function for playing a move
  function playMove(playedPiece: Piece, destination: Position): boolean {
    // Checking if the correct team has played the piece
    if (playedPiece.team !== board.currentTeam) return false

    // Checking for valid move
    const validMove = playedPiece.possibleMoves?.some((m) =>
      m.samePosition(destination)
    )

    if (!validMove) return false

    // playMove modifies the board state
    setBoard((board) => {
      const clonedBoard = board.clone()

      // Playing a move
      clonedBoard.playMove(playedPiece, destination)

      if (clonedBoard.gameOver) {
        checkmateModalRef.current?.classList.remove('hidden')
      }

      return clonedBoard
    })

    // Checking if a pawn is promoted
    if (playedPiece.isPawn) {
      if (
        (playedPiece.team === TeamType.RED && destination.y === 7) ||
        (playedPiece.team === TeamType.YELLOW && destination.y === 6) ||
        (playedPiece.team === TeamType.BLUE && destination.x === 7) ||
        (playedPiece.team === TeamType.GREEN && destination.x === 6)
      ) {
        modalRef.current?.classList.remove('hidden')
        setPromotionPawn((previousPromotionPawn) => {
          const clonedPlayedPiece = playedPiece.clone()
          clonedPlayedPiece.position = destination.clone()
          return clonedPlayedPiece
        })
      }
    }
    return true
  }

  // Function to promote a pawn to the desired piece
  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return
    }

    setBoard((previousBoard) => {
      const clonedBoard = board.clone()

      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(promotionPawn)) {
          results.push(
            new Piece(piece.position.clone(), pieceType, piece.team, true)
          )
        } else {
          results.push(piece)
        }

        return results
      }, [] as Piece[])

      clonedBoard.calculateAllMoves()

      return clonedBoard
    })

    // Toggling the modal
    modalRef.current?.classList.add('hidden')
  }

  // Deciding the type of color of the pieces when opening the modal
  function promotionTeamType() {
    if (promotionPawn?.team === TeamType.RED) {
      return 'r'
    } else if (promotionPawn?.team === TeamType.BLUE) {
      return 'b'
    } else if (promotionPawn?.team === TeamType.YELLOW) {
      return 'y'
    } else if (promotionPawn?.team === TeamType.GREEN) {
      return 'g'
    }
  }

  // Writing the full name of the winning team
  let teamNames = {
    [TeamType.RED]: 'Red',
    [TeamType.BLUE]: 'Blue',
    [TeamType.YELLOW]: 'Yellow',
    [TeamType.GREEN]: 'Green',
  }
  let teamWon = teamNames[board.currentTeam]
  let leaderboard = [board.currentTeam, ...board.loseOrder.slice().reverse()]

  let lbPieces = ['Q', 'R', 'N', 'P'] as const
  let pieceNames = {
    Q: 'Queen',
    R: 'Rook',
    N: 'Knight',
    P: 'Pawn',
  }

  function restartGame() {
    checkmateModalRef.current?.classList.add('hidden')

    setBoard(initialBoard.clone())
  }
  
  return (
    <>
      <div className='modal hidden' ref={modalRef}>
        <div className='modal-body'>
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`${basePath}/assets/images/${promotionTeamType()}R.png`}
            alt='Rook'
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`${basePath}/assets/images/${promotionTeamType()}N.png`}
            alt='Knight'
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`${basePath}/assets/images/${promotionTeamType()}B.png`}
            alt='Bishop'
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`${basePath}/assets/images/${promotionTeamType()}Q.png`}
            alt='Queen'
          />
        </div>
      </div>

      <div className='modal hidden' ref={checkmateModalRef}>
        <div className='modal-body'>
          <div className='checkmate-body'>
            <span>Winner: {teamWon}!</span>
            <table>
              <tbody>
                {leaderboard.map((team, i) => (
                  <tr key={team} className='team'>
                    <td>{i + 1}.</td>
                    <td>{teamNames[team]}</td>
                    <td>
                      <img
                        src={`${basePath}/assets/images/${team}${lbPieces[i]}.png`}
                        alt={`${teamNames[team]} ${pieceNames[lbPieces[i]]}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={restartGame}>Play Again</button>
          </div>
        </div>
      </div>

      <ChessProvider whoseTurn={board.currentTeam}>
        <ChessWrapper>
          <Chessboard
            playMove={playMove}
            pieces={board.pieces}
            loseOrder={board.loseOrder}
            isChecked={board.isChecked}
          />
        </ChessWrapper>
      </ChessProvider>
    </>
  )
}
