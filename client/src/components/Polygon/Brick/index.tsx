import * as React from "react";
import styles from './brickStyles'
import {IBrick} from '../../../services/socketService/interfaces';
import {coordsToPixels} from '../../../utils/helpers';

interface Props {
  brick: IBrick,
}

interface State {
  visible: boolean
}

class Brick extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  render() {
    return (<div style={{
          ...styles.water,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'brown',
          // backgroundImage: `url(/assets/images/water.png)`,
          transform: `translateX(${coordsToPixels(this.props.brick.x)}px) translateY(${coordsToPixels(this.props.brick.y)}px)`,
          transition: '1s linear',
        }}>
        </div>
    )
  }


}

export default Brick
