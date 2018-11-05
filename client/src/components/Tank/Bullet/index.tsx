import * as React from "react";
import styles from './bulletStyles'
import {direction} from '..';



interface Props {
  direction: direction
  onFly: boolean
  index: number
  onFinish: (index: number) => void
}

interface State {
  fire: boolean
}

class Bullet extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      fire: false,
    }
  }

  private getBulletStyles(){
    if (this.state.fire) {
      return this.getBulletOnFireStyles()
    }
  }

  public componentDidMount() {
    setTimeout(() => {
      this.setState({fire: true}, () => {
        this.onFinish()
      })
    }, 0)
    
  }

  private onFinish(){
    setTimeout(() => this.props.onFinish(this.props.index), 2000)
  }

  private getBulletOnFireStyles() {
    // console.log('this.props.direction ', this.props.direction)
    switch (this.props.direction) {
      case 'UP':
        return {
          transform: `rotate(${90}deg)`,
          top: '-2000px',
          left: '27px'
        }
      case 'DOWN':
        return {
          transform: `rotate(${90}deg)`,
          top: '2000px',
          left: '25px',
        }
      case 'LEFT':
        return {
          transform: `rotate(${0}deg)`,
          left: '-2000px',
          top: '45px'
        }
      case 'RIGHT':
        return {
          transform: `rotate(${0}deg)`,
          left: '2000px',
          top: '45px'
        }
    }
  }

  render() {
    return (
      <div style={{
        ...styles.bullet,
        ...this.getBulletStyles(),
        transition: '1s linear',
      }} />
    );
  }


}

export default Bullet
