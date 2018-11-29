import * as React from "react";
import styles from './waterStyles'
import {IWater} from '../../../services/socketService/interfaces';
import {coordsToPixels} from '../../../utils/helpers';

interface Props {
  water: IWater,
}

interface State {
  visible: boolean
}

class Water extends React.PureComponent<Props, State> {

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
          backgroundColor: 'blue',
          backgroundImage: `url(/assets/images/water.png)`,
          transform: `translateX(${coordsToPixels(this.props.water.x)}px) translateY(${coordsToPixels(this.props.water.y)}px)`,
          transition: '1s linear',
        }}>
        </div>
    )
  }


}

export default Water
