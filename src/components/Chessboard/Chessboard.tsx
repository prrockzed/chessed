import "./Chessboard.css";
import { Piece, Position } from "../../models";
import Tile from "../Tile/Tile";
import { useEffect, useRef, useState } from "react";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "../../Constants";
import { PieceType, TeamType } from '../../Types'
import { useChessContext } from "../context/ChessContext";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
  loseOrder: TeamType[];
  isChecked: boolean;
}

export default function Chessboard({ playMove, pieces, loseOrder, isChecked }: Props) {
  
  // Dynamic grid size calculation
  const getGridSize = () => {
    const vw = window.innerWidth * 0.8;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return window.innerWidth > 768 ? 2.5 * rem : vw / 14;
  };
  const GRID_SIZE = getGridSize();
  const { currentPlayer: whoseTurn } = useChessContext();

  // Piece tracking states
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [activePieceElement, setActivePieceElement] = useState<HTMLElement | null>(null);
  const [selectedPieceElement, setSelectedPieceElement] = useState<HTMLElement | null>(null);
  const [showPossibleMoves, setShowPossibleMoves] = useState<boolean>(false);

  // board related states and constants
  const chessboardRef = useRef<HTMLDivElement>(null);
  const [boardMetrics, setBoardMetrics] = useState({
    top: 0, left: 0, width: 0, height: 0
  });

  /** Calculates boundaries of the chessboard */
  const calculateBoundaries = () => {
    if (!chessboardRef.current) return null;
    
    const { left, top, width, height } = boardMetrics;
    const sidePortionWidth = 3 * GRID_SIZE;

    return {
      centralRegionLeft: left,
      centralRegionRight: left + width,
      centralRegionTop: top + sidePortionWidth,
      centralRegionBottom: top + height - sidePortionWidth,
      topBottomRegionLeft: left + sidePortionWidth,
      topBottomRegionRight: left + width - sidePortionWidth,
      topRegionBottom: top + sidePortionWidth,
      bottomRegionTop: top + height - sidePortionWidth,
      bottom: top + height
    };
  };

  // Updates board metrics on resize
  useEffect(() => {
    const updateOffset = () => {
      if (chessboardRef.current) {
        const rect = chessboardRef.current.getBoundingClientRect();
        setBoardMetrics({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  /** Transforms client position to chessboard grid position coordinates */
  const calculateGridPosition = (clientX: number, clientY: number) => ({
    x: Math.floor((clientX - boardMetrics.left) / GRID_SIZE),
    y: Math.floor((boardMetrics.height - (clientY - boardMetrics.top)) / GRID_SIZE)
  });

  /* Piece Interaction Event Handling */
  /** Handles piece grabbing event, loads piece htmlElement, piece object */
  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains("chess-piece") && chessboard) {
      const { x: grabX, y: grabY } = calculateGridPosition(e.clientX, e.clientY);
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;

      element.style.position = "fixed";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.zIndex = "100";

      setCurrentPiece(pieces.find(p => p.samePosition(new Position(grabX, grabY))) || null);
      setActivePieceElement(element);
      setShowPossibleMoves(true);
      document.body.style.userSelect = 'none';
    }
  };

  /** Handles Piece move event, restricts piece movement to insides of chessboard */
  const movePiece = (e: React.MouseEvent) => {
    if (activePieceElement && chessboardRef.current) {
      const boundaries = calculateBoundaries();
      if (!boundaries) return;

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;

      const isInsideValidRegion = (
        (x > boundaries.centralRegionLeft && 
         x < boundaries.centralRegionRight && 
         y > boundaries.centralRegionTop && 
         y < boundaries.centralRegionBottom) ||
        (x > boundaries.topBottomRegionLeft && 
         x < boundaries.topBottomRegionRight && 
         ((y > boardMetrics.top && y < boundaries.topRegionBottom) ||
          (y > boundaries.bottomRegionTop && y < boundaries.bottom)))
      );

      activePieceElement.style.position = "fixed";
      activePieceElement.style.left = `${x}px`;
      activePieceElement.style.top = `${y}px`;
      activePieceElement.style.visibility = isInsideValidRegion ? "visible" : "hidden";
    }
  };

  /** Handles piece placement event, plays the move, checks for success, reflects the result on chessboard */
  const dropPiece = (e: React.MouseEvent) => {
    if (chessboardRef.current && currentPiece) {
      const targetElement = activePieceElement || selectedPieceElement;
      if (!targetElement) return;

      const oldPosition = currentPiece.position;
      const { x: placeX, y: placeY } = calculateGridPosition(e.clientX, e.clientY);

      // Reset piece if dropped in the same position
      if (oldPosition?.x === placeX && oldPosition?.y === placeY) {
        resetPiecePosition(targetElement);
        setSelectedPieceElement(activePieceElement);
        setActivePieceElement(null);
        document.body.style.userSelect = 'auto';
        return;
      }

      const success = playMove(currentPiece.clone(), new Position(placeX, placeY));

      if (!success) {
        resetPiecePosition(targetElement);
      }

      setActivePieceElement(null);
      setShowPossibleMoves(false);
      document.body.style.userSelect = 'auto';
    }
  };

  /** Helper function for resetting piece position back to original place */
  const resetPiecePosition = (element: HTMLElement) => {
    element.style.position = "relative";
    element.style.removeProperty("top");
    element.style.removeProperty("left");
    element.style.removeProperty("z-index");
  };

  /** chessboard constructor */
  const renderBoard = () => {
    const board = [];
    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
      for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const piece = pieces.find(p => p.samePosition(new Position(i, j)));
        const highlight = showPossibleMoves && 
          currentPiece?.possibleMoves?.some(p => p.samePosition(new Position(i, j)));

        board.push(
          <Tile
            key={`${i},${j}`}
            num_i={i}
            num_j={j}
            image={piece?.image}
            highlight={!!highlight}
            teamLost={piece ? loseOrder.includes(piece.team) : false}
            check={
              isChecked &&
              piece?.type === PieceType.KING &&
              piece?.team === whoseTurn
            }
          />
        );
      }
    }
    return board;
  };

  return (
    <div
      onMouseMove={movePiece}
      onMouseDown={grabPiece}
      onMouseUp={dropPiece}
      id="chessboard"
      ref={chessboardRef}
    >
      {renderBoard()}
    </div>
  );
}
