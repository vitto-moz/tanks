import * as React from "react";
import styles from './explosionFinishStyles'
import {ICoordinate} from '../../../services/socketService/interfaces';
import {coordsToPixels} from '../../../utils/helpers';



interface Props {
  coordinate: ICoordinate
  removeFinishExplosion: (id: string) => void
}

interface State {
  visible: boolean
}

class Explosion extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  public componentDidMount() {
    setTimeout(() => {
      this.props.removeFinishExplosion(this.props.coordinate.id)
    }, 2000)
  }

  render() {
    return (
      <div style={{
        ...styles.explosion,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(/assets/images/explosion3.gif)`,
        transform: `translateX(${coordsToPixels(this.props.coordinate.x)}px) translateY(${coordsToPixels(this.props.coordinate.y)}px)`,
        transition: '1s linear',
      }}>
      </div>
    )
  }


}

export default Explosion
