import { TeamType } from '../../Types'
import './PlayerName.css'

interface Props {
  whoseTurn: TeamType
  lostTeams: TeamType[]
}
// Color names for the different players
export default function PlayerName({ whoseTurn, lostTeams }: Props) {
  return (
    <>
      <div
        className={[
          'playerName',
          'team-red',
          whoseTurn === TeamType.RED && 'player-active',
          lostTeams.includes(TeamType.RED) && 'player-lost',
        ]
          .filter((x) => x)
          .join(' ')}
      >
        Player RED
      </div>
      <div
        className={[
          'playerName',
          'team-blue',
          whoseTurn === TeamType.BLUE && 'player-active',
          lostTeams.includes(TeamType.BLUE) && 'player-lost',
        ]
          .filter((x) => x)
          .join(' ')}
      >
        Player BLUE
      </div>
      <div
        className={[
          'playerName',
          'team-yellow',
          whoseTurn === TeamType.YELLOW && 'player-active',
          lostTeams.includes(TeamType.YELLOW) && 'player-lost',
        ]
          .filter((x) => x)
          .join(' ')}
      >
        Player YELLOW
      </div>
      <div
        className={[
          'playerName',
          'team-green',
          whoseTurn === TeamType.GREEN && 'player-active',
          lostTeams.includes(TeamType.GREEN) && 'player-lost',
        ]
          .filter((x) => x)
          .join(' ')}
      >
        Player GREEN
      </div>
    </>
  )
}
