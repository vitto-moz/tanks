import * as React from "react";
import styles from './explosionStyles'
import {ICollision} from '../../../services/socketService/interfaces';
import {coordsToPixels} from '../../../utils/helpers';



interface Props {
  collision: ICollision,
  onExplosion: (collision: ICollision) => void
}

interface State {
  visible: boolean
}

class Explosion extends React.PureComponent<Props, State> {
  private mounted: boolean = true
  constructor(props: Props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  public componentDidMount() {
    setTimeout(() => {
      if (this.mounted) {
        this.setState({visible: true})
        this.props.onExplosion(this.props.collision)
      }
    }, 500)
    setTimeout(() => {
      this.mounted && this.setState({visible: false})
    }, 2000)
  }

  public componentWillUnmount(){
    this.mounted = false
  }

  render() {
    return (
      this.state.visible
        ? <div style={{
          ...styles.explosion,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(https://gifimage.net/wp-content/uploads/2017/11/explosion-animated-gif-transparent-11.gif)`,
          transform: `translateX(${coordsToPixels(this.props.collision.x)}px) translateY(${coordsToPixels(this.props.collision.y)}px)`,
          transition: '1s linear',
        }}>
        </div> : null
    )
  }


}

export default Explosion
