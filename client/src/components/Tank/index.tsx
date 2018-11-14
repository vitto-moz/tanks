import * as React from "react";
import styles from './tankStyles'
import {Subject, interval} from 'rxjs'
import {throttle} from 'rxjs/operators'
import Trunk from './Trunk';
import Bullet from './Bullet';
import {ITank} from '../../services/socketService/interfaces';

export type direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'SPACE'

export interface IKeysCodes {
  [index: string]: direction;
}

export interface IKeyAction {
  [index: string]: number;
}

export interface IKeyActions {
  [index: string]: IKeyAction;
}

export interface IBullet {
  onFly: boolean;
  direction: direction;
}

const KEYS_CODES: IKeysCodes = {
  37: 'LEFT',
  39: 'RIGHT',
  38: 'UP',
  40: 'DOWN',
  32: 'SPACE'
}

const QUANTUM = 100
const UPDATE_TIME = 999

const keysActions: IKeyActions = {
  LEFT: {left: -QUANTUM},
  RIGHT: {left: +QUANTUM},
  UP: {top: -QUANTUM},
  DOWN: {top: +QUANTUM},
}


interface Props {
  tank: ITank
}

interface State {
  top: number
  left: number
  direction: direction
  fire: boolean
  bullets: IBullet[]
}


class Tank extends React.PureComponent<Props, State> {
  private onKeyPress$: Subject<number> = new Subject()

  state: State = {
    top: 0,
    left: 0,
    direction: 'DOWN',
    fire: false,
    bullets: []
  }

  constructor(props: Props) {
    super(props)
    // this.onKeyPress$.pipe(
    //   throttle(() => interval(UPDATE_TIME)),
    // ).subscribe((keyCode) => this.move(keyCode))
    // this.onFireFinish = this.onFireFinish.bind(this)
  }

  // private move(keyCode: number) {
  //   const action = keysActions[KEYS_CODES[keyCode]]
  //   const direction = KEYS_CODES[keyCode]
  //   this.setState(prevState => {
  //     return {
  //       top: action.top ? prevState.top + action.top : prevState.top,
  //       left: action.left ? prevState.left + action.left : prevState.left,
  //       direction
  //     }
  //   })
  // }

  // private onFire() {
  //   this.setState(prevState => {
  //     const bullets = [...prevState.bullets]
  //     bullets.push({onFly: true, direction: prevState.direction})
  //     return {fire: true, bullets}
  //   }, () => {
  //     setTimeout(() => {
  //       this.setState(prevState => {
  //         const bullets = prevState.bullets
  //         bullets[bullets.length - 1] = {onFly: false, direction: prevState.direction}
  //         return {bullets}
  //       })
  //     }, 3000)
  //   })
  // }

  // private onFireFinish(index: number) {
  //   this.setState(prevState => {
  //     const bullets = [...prevState.bullets]
  //     const bulletOnFinish = {...bullets[index]}
  //     bulletOnFinish.onFly = false
  //     bullets[index] = bulletOnFinish
  //     return {bullets}

  //   })
  // }

  // public componentDidMount() {
  //   document.addEventListener('keydown', (event) => {
  //     if (KEYS_CODES[event.which] === 'SPACE') {
  //       this.onFire()
  //     } else {
  //       this.onKeyPress$.next(event.which)
  //     }
  //   });
  // }

  render() {
    return (
      <div style={{
        ...styles.tank,
        transform: `translateX(${this.props.tank.x}px) translateY(${this.props.tank.y}px)`,
        transition: '1s linear',
        // transform: `translateY(${this.state.top}px)`
      }} >
        <Trunk direction={this.props.tank.direction} />
        {/* {this.state.bullets.map((bullet, index) => {
          return bullet.onFly
            ? <Bullet
              key={index}
              index={index}
              direction={bullet.direction}
              onFly={bullet.onFly}
              onFinish={this.onFireFinish} 
              />
            : null
        })} */}

      </div>
    )
  }


}

export default Tank
