import './Tile.css'

// Interface for deciding the types
interface Props {
  image?: string
  num_i: number
  num_j: number
  highlight: boolean
}

export default function Tile({ num_i, num_j, image, highlight }: Props) {
  const className: string = [
    'tile',
    (num_i + num_j) % 2 === 0 && 'dark-tile', // Dark Tiles
    (num_i + num_j) % 2 !== 0 && 'light-tile', // Light Tiles
    highlight && 'tile-highlight', // Highlighting the tiles with possible moves
    image && 'chess-piece-tile', // Highlighting the tiles with attacked chess pieces
  ]
    .filter(Boolean)
    .join(' ')

  // Useless tiles
  // Useless tiles are those tiles which are at the corners of the 'squared' chess board
  if (
    (num_i < 3 && num_j < 3) ||
    (num_i > 10 && num_j < 3) ||
    (num_i > 10 && num_j > 10) ||
    (num_i < 3 && num_j > 10)
  ) {
    return <div className='tile useless'></div>
  }

  // Chessboard tiles
  else {
    return (
      <div className={className}>
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className='chess-piece'
          ></div>
        )}
      </div>
    )
  }
}
