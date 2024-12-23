import { Piece, Position } from '../models'
import { TeamType } from '../Types'
import {
  tileIsOccupied,
  tileIsOccupiedByOpponent,
  tileIsEmptyOrOccupiedByOpponent,
} from './GeneralRules'

// Rules to move the Kings
export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  // Checking for king moves
  for (let i = 1; i < 2; i++) {
    let multiplierX =
      desiredPosition.x < initialPosition.x
        ? -1
        : desiredPosition.x > initialPosition.x
        ? 1
        : 0
    let multiplierY =
      desiredPosition.y < initialPosition.y
        ? -1
        : desiredPosition.y > initialPosition.y
        ? 1
        : 0

    let passedPosition = new Position(
      initialPosition.x + i * multiplierX,
      initialPosition.y + i * multiplierY
    )

    // Checking if the tile is occupied/empty
    if (passedPosition.samePosition(desiredPosition)) {
      if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
        return true
      }
    } else {
      if (tileIsOccupied(passedPosition, boardState)) {
        break
      }
    }
  }

  return false
}

// Checking possible moves for the Kings to highlight the grids
export const getPossibleKingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = []

  // Top movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y + i)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  // Bottom movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x, king.position.y - i)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  // Left movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  // Right movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  // Upper right movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y + i)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  // Bottom right movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x + i, king.position.y - i)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  // Bottom left movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y - i)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  // Top left movement
  for (let i = 1; i < 2; i++) {
    const destination = new Position(king.position.x - i, king.position.y + i)

    // If the move is outside of the board don't add it
    if (
      (destination.x < 3 && destination.y < 3) ||
      (destination.x > 10 && destination.y < 3) ||
      (destination.x > 10 && destination.y > 10) ||
      (destination.x < 3 && destination.y > 10) ||
      destination.x < 0 ||
      destination.x > 13 ||
      destination.y < 0 ||
      destination.y > 13
    ) {
      break
    }

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination)
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination)
      break
    } else {
      break
    }
  }

  return possibleMoves
}

// Getting the castling moves for the king
// In this method, enemy moves have already been calculated
export const getCastlingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Castling is not allowed if the king has moved
  if (king.hasMoved) return possibleMoves;

  // Get unmoved rooks from the king's team
  const rooks = boardState.filter(
    (p) => p.isRook && p.team === king.team && !p.hasMoved
  );

  // Check if the king is in check
  const enemyPieces = boardState.filter((p) => p.team !== king.team);
  const isKingInCheck = enemyPieces.some((enemy) =>
    enemy.possibleMoves?.some((move) => move.samePosition(king.position))
  );

  if (isKingInCheck) return possibleMoves; // Castling not allowed if king is in check

  // Loop through the rooks to determine valid castling moves
  for (const rook of rooks) {
    const direction =
      rook.team === TeamType.RED || rook.team === TeamType.YELLOW
        ? rook.position.x - king.position.x > 0
          ? 1
          : -1
        : rook.position.y - king.position.y > 0
        ? 1
        : -1;

    // Check the path between the king and the rook
    const path: Position[] = [];
    const currentPosition = king.position.clone();
    while (!currentPosition.samePosition(rook.position)) {
      if (king.team === TeamType.RED || king.team === TeamType.YELLOW) {
        currentPosition.x += direction;
      } else {
        currentPosition.y += direction;
      }
      path.push(currentPosition.clone());
    }

    // Exclude the rook's position from the path
    path.pop();

    // Ensure all tiles in the path are not under attack and are empty
    const isPathClear = path.every((tile) => {
      const isTileEmpty = !boardState.some((piece) =>
        piece.position.samePosition(tile)
      );
      const isTileSafe = !enemyPieces.some((enemy) =>
        enemy.possibleMoves?.some((move) => move.samePosition(tile))
      );
      return isTileEmpty && isTileSafe;
    });

    if (!isPathClear) continue;

    // Add the rook's position as a valid castling move
    possibleMoves.push(rook.position.clone());
  }

  return possibleMoves;
};
