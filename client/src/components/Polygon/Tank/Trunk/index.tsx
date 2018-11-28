import * as React from "react";
import styles from './trunkStyles'
import {Subject, interval} from 'rxjs'
import {throttle} from 'rxjs/operators'
import {direction} from '..';



interface Props {
  direction: direction
}

class Trunk extends React.PureComponent<Props, {}> {

  constructor(props: Props) {
    super(props)
  }

  private getTrunkStyles() {
    switch (this.props.direction) {
      case 'UP':
        return {
          transform: `rotate(${90}deg)`,
          top: '-30px',
          left: '27px'
        }
      case 'DOWN':
        return {
          transform: `rotate(${90}deg)`,
          top: '120px',
          left: '25px',
        }
      case 'LEFT':
        return {
          transform: `rotate(${0}deg)`,
          left: '-50px',
          top: '45px'
        }
      case 'RIGHT':
        return {
          transform: `rotate(${0}deg)`,
          left: '100px',
          top: '45px'
        }
    }
  }

  render() {
    return (
      <div style={{
        ...styles.trunk,
        ...this.getTrunkStyles(),
      }} />
    );
  }


}

export default Trunk
