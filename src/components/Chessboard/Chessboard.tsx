import './Chessboard.css'
import PlayerName from '../PlayerName/PlayerName'
import { Piece, Position } from '../../models'
import Tile from '../Tile/Tile'
import { useRef, useState } from 'react'
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from '../../Constants'

// Interface deciding the types
interface Props {
  playMove: (piece: Piece, position: Position) => boolean
  pieces: Piece[]
  whoseTurn: number
}

export default function Chessboard({ playMove, pieces, whoseTurn }: Props) {
  // Declaring Constants
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
  const [grabPosition, setGrabPosition] = useState<Position>(
    new Position(-1, -1)
  )
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const chessboardRef = useRef<HTMLDivElement>(null)

  // Function when player grabs a  piece
  function grabPiece(e: React.MouseEvent) {
    // Grabbing the pieces off the chessboard
    const chessboard = chessboardRef.current
    const element = e.target as HTMLElement

    if (element.classList.contains('chess-piece') && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
      const grabY = Math.abs(
        Math.abs(
          Math.ceil((e.clientY - chessboard.offsetTop - 700) / GRID_SIZE)
        )
      )

      setGrabPosition(new Position(grabX, grabY))

      const x = e.clientX - GRID_SIZE / 2
      const y = e.clientY - GRID_SIZE / 2

      element.style.position = 'absolute'
      element.style.left = `${x}px`
      element.style.top = `${y}px`

      setActivePiece(element)
      setIsClicked(false)
      document.body.style.userSelect = 'none'
    }
  }

  // Function when player clicks a piece
  function clickPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current
    const element = e.target as HTMLElement

    if (element.classList.contains('chess-piece') && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
      const grabY = Math.abs(
        Math.abs(
          Math.ceil((e.clientY - chessboard.offsetTop - 700) / GRID_SIZE)
        )
      )

      setGrabPosition(new Position(grabX, grabY))
      setActivePiece(element)
      setIsClicked(true)
    }
  }


  // Function when player tries to move a piece
  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current

    if (activePiece && chessboard) {
      // Declaring constants for restricting the pieces
      const leftX = chessboard.offsetLeft - 4
      const midleftX =
        chessboard.offsetLeft + (chessboard.clientWidth / 14) * 3 - 4
      const topY = chessboard.offsetTop - 4
      const midtopY =
        chessboard.offsetTop + (chessboard.clientHeight / 14) * 3 - 4
      const rightX = chessboard.offsetLeft + chessboard.clientWidth - 46
      const midrightX =
        chessboard.offsetLeft -
        (chessboard.clientWidth / 14) * 3 +
        chessboard.clientWidth -
        46
      const bottomY = chessboard.offsetTop + chessboard.clientHeight - 46
      const midbottomY =
        chessboard.offsetTop -
        (chessboard.clientHeight / 14) * 3 +
        chessboard.clientHeight -
        46
      const x = e.clientX - GRID_SIZE / 2
      const y = e.clientY - GRID_SIZE / 2
      activePiece.style.position = 'absolute'

      // Restricting the x position
      if (x < leftX) {
        activePiece.style.left = `${leftX}px`
      } else if (x > rightX) {
        activePiece.style.left = `${rightX}px`
      } else {
        activePiece.style.left = `${x}px`
      }

      // Restricting the y position
      if (y < topY) {
        activePiece.style.top = `${topY}px`
      } else if (y > bottomY) {
        activePiece.style.top = `${bottomY}px`
      } else {
        activePiece.style.top = `${y}px`
      }

      // Restricting the cutout portions
      if ((x < midleftX && y > midbottomY) || (x < midleftX && y < midtopY)) {
        activePiece.style.left = `${midleftX}px`
      } else if (
        (x > midrightX && y > midbottomY) ||
        (x > midrightX && y < midtopY)
      ) {
        activePiece.style.left = `${midrightX}px`
      }
    }
  }

  // Function when player drops a piece
  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current

    // Dropping the pieces on the right grid
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 700) / GRID_SIZE)
      )

      const currentPiece = pieces.find((p) => p.samePosition(grabPosition))

      if (currentPiece) {
        var success = playMove(currentPiece.clone(), new Position(x, y))

        if (!success) {
          // Resets the piece position
          activePiece.style.position = 'static'
          activePiece.style.removeProperty('top')
          activePiece.style.removeProperty('left')
        }
      }

      setActivePiece(null)
      document.body.style.userSelect = 'auto'
    }
  }

  // Setting the four player chessboard
  let board = []

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const num_i = i
      const num_j = j
      const piece = pieces.find((p) => p.samePosition(new Position(i, j)))
      let image = piece ? piece.image : undefined

      let currentPiece =
        activePiece != null
          ? pieces.find((p) => p.samePosition(grabPosition))
          : undefined

      // For highlighting the attacked pieces
      let highlight = currentPiece?.possibleMoves
        ? currentPiece.possibleMoves.some((p) =>
            p.samePosition(new Position(i, j))
          )
        : false

      // Made chessboard with all the 'useful' squares
      board.push(
        <Tile
          key={`${i},${j}`}
          num_i={num_i}
          num_j={num_j}
          image={image}
          highlight={highlight}
        />
      )
    }
  }

  return (
    <>
      <div
        onMouseMove={(e) => {
          if (!isClicked) {
            movePiece(e)
          }   
        }}
        onMouseDown={(e) => grabPiece(e)}
        onClick={(e) => clickPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id='chessboard'
        ref={chessboardRef}
      >
        {board}
        <PlayerName whoseTurn={whoseTurn} />
      </div>
    </>
  )
}
