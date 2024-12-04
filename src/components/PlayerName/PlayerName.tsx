import './PlayerName.css'

interface Props {
  whoseTurn: number
}
// Color names for the different players
export default function PlayerName({ whoseTurn }: Props) {
  let red = ''
  let yellow = ''
  let blue = ''
  let green = ''
  if (whoseTurn % 4 === 1) {
    red = 'RED'
  } else if (whoseTurn % 4 === 2) {
    blue = 'BLUE'
  } else if (whoseTurn % 4 === 3) {
    yellow = 'YELLOW'
  } else if (whoseTurn % 4 === 0) {
    green = 'GREEN'
  }

  return (
    <>
      <div id={red} className='playerName team-red'>
        Player RED
      </div>
      <div id={blue} className='playerName team-blue'>
        Player BLUE
      </div>
      <div id={yellow} className='playerName team-yellow'>
        Player YELLOW
      </div>
      <div id={green} className='playerName team-green'>
        Player GREEN
      </div>
    </>
  )
}
