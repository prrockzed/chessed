import { Board } from '../../models/Board'
import Chessboard from '../Chessboard/Chessboard'
import { initialBoard } from '../../Constants'
import { PieceType, TeamType } from '../../Types'
import { Piece, Position } from '../../models'
import { useRef, useState } from 'react'
import "./Arbiter.css"
export default function Arbiter() {
  // Declaring the constants
  const [board, setBoard] = useState<Board>(initialBoard.clone())
  const [boardHistory, setBoardHistory] = useState<Board[]>([initialBoard.clone()])
  const [promotionPawn, setPromotionPawn] = useState<Piece>()
  const [moveHistory, setMoveHistory] = useState<{ [key in TeamType]: string[] }>({
    [TeamType.RED]: [],
    [TeamType.BLUE]: [],
    [TeamType.YELLOW]: [],
    [TeamType.GREEN]: [],
  });
  const modalRef = useRef<HTMLDivElement>(null)
  const checkmateModalRef = useRef<HTMLDivElement>(null)

  // Checks for production/development
  const basePath = window.location.hostname === 'localhost' ? '/chessed' : ''

  // Function for playing a move
  function playMove(playedPiece: Piece, destination: Position): boolean {
    if(board.totalTurns !== boardHistory.length - 1) {
      return false;
    }
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
      setBoardHistory([...boardHistory, clonedBoard])
      //getting the algebraic notation of the move
      let move = getAlgebraicNotation(playedPiece, destination)

      //checking if the move leads to check
      let chk=false;
      const kings=clonedBoard.pieces.filter((p) => p.isKing && p.team !== playedPiece.team)
      const currentTeamPieces = clonedBoard.pieces.filter((p) => p.team === playedPiece.team)
      currentTeamPieces.forEach((piece) => {
        const moves = clonedBoard.getValidMoves(piece,clonedBoard.pieces)
        if(moves.some((m) => kings.some((k) => k.samePosition(m)))) {
          chk=true;
        }
      })
      if(chk){
        move = `${move}+`
      }

      // Update move history for the current team
      setMoveHistory((prevHistory) => ({
        ...prevHistory,
        [playedPiece.team]: [...prevHistory[playedPiece.team], move],
      }));
      //checking if the game is over
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
  function numberToLetter(num: number): string {
    // ASCII code for 'a' is 97, so we add (num - 1) to 97
    return String.fromCharCode(97 + num);
  }
  // Function to promote a pawn to the desired piece
  function getAlgebraicNotation(piece: Piece,destination: Position): string {
    
    if(piece.isPawn){
      let chk = board.pieces.some((piece)=>piece.samePosition(destination))
      return `${numberToLetter(destination.x)}${chk === true?'x':''}${destination.y}`
    }
    else if(piece.isKing){
      let chk = board.pieces.some((piece)=>piece.samePosition(destination))
      const dist=Math.abs(destination.x-piece.position.x)+Math.abs(destination.y-piece.position.y)
      if(dist===3){
        return 'O-O'
      }
      else if(dist===4){
        return 'O-O-O'
      }
      return `K${chk === true?'x':''}${numberToLetter(destination.x)}${destination.y}`
    }
    else if(piece.isQueen){
      let chk = board.pieces.some((piece)=>piece.samePosition(destination))
      return `Q${chk === true?'x':''}${numberToLetter(destination.x)}${destination.y}`
    }
    else if(piece.isRook){
      let chk = board.pieces.some((piece)=>piece.samePosition(destination))
      return `R${chk === true?'x':''}${numberToLetter(destination.x)}${destination.y}`
    }
    else if(piece.isBishop){
      let chk = board.pieces.some((piece)=>piece.samePosition(destination))
      return `B${chk === true?'x':''}${numberToLetter(destination.x)}${destination.y}`
    }
    else if(piece.isKnight){
      let chk = board.pieces.some((piece)=>piece.samePosition(destination))
      return `N${chk === true?'x':''}${numberToLetter(destination.x)}${destination.y}`
    }
    return "#"
  }
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
    
    //updating the move history when pawn is promoted
    let promotionNotation="";
    if(pieceType===PieceType.ROOK){
      promotionNotation='=R'
    }
    else if(pieceType===PieceType.KNIGHT){
      promotionNotation='=N'
    }
    else if(pieceType===PieceType.BISHOP){
      promotionNotation='=B'
    }
    else if(pieceType===PieceType.QUEEN){
      promotionNotation='=Q'
    }
    let teamHistory =moveHistory[promotionPawn.team]
    teamHistory[teamHistory.length-1]=teamHistory[teamHistory.length-1]+promotionNotation
    setMoveHistory((prevHistory) => ({
      ...prevHistory,
      [promotionPawn.team]: [...teamHistory],
    }));
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
  function gotToMove(moveNumber:number){
    if(moveNumber >= 0 && moveNumber<boardHistory.length){
      setBoard(boardHistory[moveNumber])
    }
  }
  function restartGame() {
    checkmateModalRef.current?.classList.add('hidden')
    setBoardHistory([initialBoard.clone()])
    setBoard(initialBoard.clone())
    setMoveHistory({
      [TeamType.RED]: [],
      [TeamType.BLUE]: [],
      [TeamType.YELLOW]: [],
      [TeamType.GREEN]: [],
    });
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

      <Chessboard
        playMove={playMove}
        pieces={board.pieces}
        whoseTurn={board.currentTeam}
        loseOrder={board.loseOrder}
        isChecked={board.isChecked}
      />
     <div className="move-history">
        <button 
          disabled={board.totalTurns === 0}
          onClick={() => gotToMove(board.totalTurns - 1)}
        >
          Previous
        </button>
        <span style={{color: 'white'}}>Move {board.totalTurns} of {boardHistory.length - 1}</span>
        <button 
          disabled={board.totalTurns === boardHistory.length - 1}
          onClick={() => gotToMove(board.totalTurns + 1)}
        >
          Next
        </button>
      </div>
      <div className="move-history-list" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white'}}>
        <table>
          <thead>
            <tr>
              <th>Red</th>
              <th>Blue</th>
              <th>Yellow</th>
              <th>Green</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(...Object.values(moveHistory).map(moves => moves.length)) }).map((_, index) => (
              <tr key={index}>
                <td>{moveHistory[TeamType.RED][index] || ''}</td>
                <td>{moveHistory[TeamType.BLUE][index] || ''}</td>
                <td>{moveHistory[TeamType.YELLOW][index] || ''}</td>
                <td>{moveHistory[TeamType.GREEN][index] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
