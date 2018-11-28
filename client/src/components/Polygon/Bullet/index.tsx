import * as React from "react";
import styles from './bulletStyles'
import {IBullet} from '../../../services/socketService/interfaces';
import {coordsToPixels} from '../../../utils/helpers';



interface Props {
  bullet: IBullet
}

interface State {
  visible: boolean
}

class Bullet extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  public componentDidMount() {
    setTimeout(() => {
      this.setState({visible: true})
    }, 1200)
  }


  render() {
    return (
      <div
        style={{
          ...styles.bullet,
          // ...this.getBulletStyles(),
          transform: `translateX(${coordsToPixels(this.props.bullet.x)}px) translateY(${coordsToPixels(this.props.bullet.y)}px)`,
          transition: '1s linear',
          opacity: this.state.visible ? 1 : 0
        }} />
    );
  }


}

export default Bullet
