import { PieceType, TeamType } from '../Types'
import { Position } from './Position'

// Exporting the piece class
export class Piece {
  image: string
  position: Position
  type: PieceType
  team: TeamType
  possibleMoves: Position[]
  hasMoved: boolean

  constructor(
    position: Position,
    type: PieceType,
    team: TeamType,
    hasMoved: boolean,
    possibleMoves: Position[] = []
  ) {
    const basePath = window.location.hostname === 'localhost' ? 'chessed/' : ''

    this.image = `${basePath}assets/images/${team}${type}.png`
    this.position = position
    this.type = type
    this.team = team
    this.possibleMoves = possibleMoves
    this.hasMoved = hasMoved
  }

  get isPawn(): boolean {
    return this.type === PieceType.PAWN
  }

  get isRook(): boolean {
    return this.type === PieceType.ROOK
  }

  get isKing(): boolean {
    return this.type === PieceType.KING
  }

  // function for same piece position
  samePiecePosition(otherPiece: Piece): boolean {
    return this.position.samePosition(otherPiece.position)
  }

  // function for comparing same position
  samePosition(otherPosition: Position): boolean {
    return this.position.samePosition(otherPosition)
  }

  // cloning piece
  clone(): Piece {
    return new Piece(
      this.position.clone(),
      this.type,
      this.team,
      this.hasMoved,
      this.possibleMoves?.map((m) => m.clone())
    )
  }
}
