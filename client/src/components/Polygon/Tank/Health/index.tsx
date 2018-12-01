import * as React from "react";
import styles from './healthStyles'
import {TeamId} from '../../../../services/socketService/interfaces';

interface Props {
  hp: number,
  teamId: TeamId,
}

const TEAM_COLORS: {[index: string]: string} = {
  YELLOW: 'yellow',
  GREEN: 'green',
}

class Health extends React.PureComponent<Props, {}> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <div style={styles.healthWrap} >
        <div style={{
          ...styles.health,
          backgroundColor: TEAM_COLORS[this.props.teamId],
          width: `${this.props.hp}%`,
        }} />
      </div>
    );
  }


}

export default Health
