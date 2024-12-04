import './Chessboard.css'
// import PlayerName from '../PlayerName/PlayerName'
import { Piece, Position } from '../../models'
import Tile from '../Tile/Tile'
import { useEffect, useRef, useState } from 'react'
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from '../../Constants'
import { useChessContext } from '../context/ChessContext'

// Interface deciding the types
interface Props {
  playMove: (piece: Piece, position: Position) => boolean
  pieces: Piece[]
}

export default function Chessboard({ playMove, pieces }: Props) {
  /** Gets the grid size based on the window size dynamically */
  const getGridSize = () => {
    // basically imitates the same logic as in the css file
    const vw = window.innerWidth * 0.9;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    if (window.innerWidth > 768) {
      return 2.5 * rem;
    } else {
      return vw / 14;
    }
  }
  const GRID_SIZE = getGridSize();
  
  // piece interaction and tracking
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [activePieceElement, setActivePieceElement] = useState<HTMLElement | null>(null);

  // board related states
  const chessboardRef = useRef<HTMLDivElement>(null)
  const [boardMetrics, setBoardMetrics] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({ top: 0, left: 0, width: 0, height: 0 });
  const { interactionMode } = useChessContext();
  const boundaries = useRef({
    centralRegionLeft: 0,
    topBottomRegionLeft: 0,
    centralRegionRight: 0,
    topBottomRegionRight: 0,
    centralRegionTop: 0,
    centralRegionBottom: 0,
    topRegionBottom: 0,
    bottomRegionTop: 0,
    bottom: 0,
  }); // ref object to store boundaries of the chessboard

  // player turn related states
  const [playerState, setPlayerState] = useState<'playerIdle' | 'playerMovingPiece'>('playerIdle');

  // logDebug function for debugging
  /* const logDebug = (message: string, data?: any) => {
    console.log(`🐞 Chessboard Debug: ${message}`, data || '')
  } */

  useEffect(() => {
    // calculates the boundaries of the chessboard only when the chessboard is resized
    if (chessboardRef.current && boardMetrics) {
      const { top, left, height, width } = boardMetrics;
      const sidePortionWidth =  3 * GRID_SIZE;
      boundaries.current = {
        centralRegionLeft: left,
        topBottomRegionLeft: left + sidePortionWidth,
        centralRegionRight: left + width,
        topBottomRegionRight: left + width - sidePortionWidth,
        centralRegionTop: top + sidePortionWidth,
        centralRegionBottom: top + height - sidePortionWidth,
        topRegionBottom: top + sidePortionWidth,
        bottomRegionTop: top + height - sidePortionWidth,
        bottom: top + height,
      };
    }
  }, [boardMetrics, GRID_SIZE]);

  useEffect(() => {
    // updates the offset of the chessboard when the window is resized
    const updateOffset = () => {
      if(chessboardRef.current) {
        const rect = chessboardRef.current.getBoundingClientRect();
        setBoardMetrics({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        })
      }
    }

    updateOffset();
    window.addEventListener('resize', updateOffset);

    return () => window.removeEventListener('resize', updateOffset);
  }, [])

  useEffect(() => {
    // changes the cursor style of the pieces based on the interaction mode
    const cursorClass = interactionMode === 'drag' ? 'cursor-grab' : 'cursor-pointer';
    const pieces = Array.from(document.getElementsByClassName('chess-piece'));

    pieces.forEach((piece) => {
      piece.classList.remove('cursor-grab', 'cursor-pointer');
      piece.classList.add(cursorClass);
    });
  }, [interactionMode])

  /** Calculates the grid position of a piece based on the clientX and clientY */
  function calculateGridPosition(clientX: number, clientY: number) {
    return {
      x: Math.floor((clientX - boardMetrics.left) / GRID_SIZE),
      y: Math.floor((boardMetrics.height - (clientY - boardMetrics.top)) / GRID_SIZE)
    }
  }

  /** loads the grabbed/selected piece Object into the state */
  function getCurrentPieceSetToState(grabX: number, grabY: number) {
    const curPiece = pieces.find((p) => p.samePosition(new Position(grabX, grabY)));
    curPiece ? setCurrentPiece(curPiece) : setCurrentPiece(null);
  }

  /** Handles chess piece grabbing event */
  function grabPiece(e: React.MouseEvent) {
    if(interactionMode === 'select') return;

    const chessboard = chessboardRef.current;
    const element = e.target as HTMLElement;
    
    if (element.classList.contains('chess-piece') && chessboard) {
      const { x: grabX, y: grabY } = calculateGridPosition(e.clientX, e.clientY)
      
      // center adjustment
      const x = e.clientX - GRID_SIZE / 2
      const y = e.clientY - GRID_SIZE / 2
      
      element.style.position = 'fixed'
      element.style.left = `${x}px`
      element.style.top = `${y}px`
      element.style.zIndex = '100';
      
      getCurrentPieceSetToState(grabX, grabY);
      setActivePieceElement(element);
      setPlayerState('playerMovingPiece');
    }
  }

  /** Handles chess piece click/select event */
  function clickPiece(e: React.MouseEvent) {
    if(interactionMode === 'drag') return;

    const chessboard = chessboardRef.current
    const element = e.target as HTMLElement

    if (element.classList.contains('chess-piece') && chessboard) {
      const { x: grabX, y: grabY } = calculateGridPosition(e.clientX, e.clientY)
      getCurrentPieceSetToState(grabX, grabY);
      setActivePieceElement(element);
      setPlayerState('playerMovingPiece');
    }
  }


  /** Handles chess piece move event */
  function movePiece(e: React.MouseEvent) {
    if(interactionMode === 'select') return;
    const chessboard = chessboardRef.current;

    if (activePieceElement && chessboard) {
      const { top } = boardMetrics;
      const { 
        centralRegionLeft, 
        topBottomRegionLeft, 
        centralRegionRight, 
        topBottomRegionRight, 
        centralRegionTop, 
        centralRegionBottom, 
        topRegionBottom, 
        bottomRegionTop, 
        bottom 
      } = boundaries.current;

      // adjusting peice position to center
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;

      // topPortion, centralRegion = centralSquare+leftPortion+rightPortion, bottomPortion
      const isInsideValidRegion = !!(
        ((x > centralRegionLeft && x < centralRegionRight) && (y > centralRegionTop && y < centralRegionBottom)) || 
        ((x > topBottomRegionLeft && x < topBottomRegionRight) && (
          (y > top && y < topRegionBottom) ||
          (y > bottomRegionTop && y < bottom)
        ))
      );

      if(isInsideValidRegion) {
        activePieceElement.style.position = 'fixed'
        activePieceElement.style.left = `${x}px`
        activePieceElement.style.top = `${y}px`
        activePieceElement.style.visibility = 'visible';
      } else {
        activePieceElement.style.visibility = 'hidden';
      }
    }
  }

  /** handles piece drop event */
  function dropPiece(e: React.MouseEvent) {
    if(interactionMode === 'select') return;
    const chessboard = chessboardRef.current

    // Dropping the pieces on the right grid
    if (activePieceElement && chessboard) {
      const { x: placeX, y: placeY } = calculateGridPosition(e.clientX, e.clientY);

      if (currentPiece) {
        var success = playMove(currentPiece.clone(), new Position(placeX, placeY))

        if (!success) {
          // Resets the piece position
          activePieceElement.style.position = 'relative'
          activePieceElement.style.removeProperty('top')
          activePieceElement.style.removeProperty('left')
          activePieceElement.style.removeProperty('z-index');
        }
      }

      setPlayerState('playerIdle');
      setActivePieceElement(null)
    }
  }

  /** handles piece target selection event, applicable only in interactionMode: 'select' */
  function dropPieceSelectMode(e: React.MouseEvent) {
    if(interactionMode === 'drag' || playerState !== 'playerMovingPiece') return;
    const chessboard = chessboardRef.current
    if (activePieceElement && chessboard && currentPiece && playerState === 'playerMovingPiece') {
      const { x: placeX, y: placeY } = calculateGridPosition(e.clientX, e.clientY);
      var success = playMove(currentPiece.clone(), new Position(placeX, placeY))
      if (!success) {
        // Resets the piece position
        activePieceElement.style.position = 'relative'
        activePieceElement.style.removeProperty('top')
        activePieceElement.style.removeProperty('left')
        activePieceElement.style.removeProperty('z-index');
      }
      setPlayerState('playerIdle');
      setActivePieceElement(null);
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

      // For highlighting all the possible moves
      let highlight = false;
      // Check if player is in the 'playerMovingPiece' state
      if (playerState === 'playerMovingPiece' && currentPiece?.possibleMoves) {
        highlight = currentPiece.possibleMoves.some((p) =>
          p.samePosition(new Position(i, j))
        );
      }

      // Made chessboard with all the 'useful' squares
      board.push(
        <Tile
          key={`${i},${j}`}
          num_i={num_i}
          num_j={num_j}
          image={image}
          highlight={highlight}
          interactionMode={interactionMode}
        />
      )
    }
  }

  return (
    <>
      <div
        onMouseMove={(e) => {
          if (interactionMode === 'drag') {
            movePiece(e)
          }
        }}
        onMouseDown={(e) => grabPiece(e)}
        onClick={(e) => clickPiece(e)}
        onMouseUp={(e) => {interactionMode === 'select' ? dropPieceSelectMode(e) : dropPiece(e)}}
        id='chessboard'
        ref={chessboardRef}
      >
        {board}
      </div>
    </>
  )
}
