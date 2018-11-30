import * as React from "react";
import styles from './healthStyles'

interface Props {
  hp: number
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
          width: `${this.props.hp}%`,
        }}/>
      </div>
    );
  }


}

export default Health
