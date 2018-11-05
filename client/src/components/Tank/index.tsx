import * as React from "react";
import styles from './tankStyles'
import {Subject, interval} from 'rxjs'
import {throttle} from 'rxjs/operators'
import Trunk from './Trunk';

export type direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN'

interface State {
  top: number
  left: number
  direction: direction
}

export interface IKeysCodes {
  [index: string]: direction;
}

export interface IKeyAction {
  [index: string]: number;
}

export interface IKeyActions {
  [index: string]: IKeyAction;
}

const KEYS_CODES: IKeysCodes = {
  37: 'LEFT',
  39: 'RIGHT',
  38: 'UP',
  40: 'DOWN'
}

const QUANTUM = 100
const UPDATE_TIME = 1000

const keysActions: IKeyActions = {
  LEFT: {left: -QUANTUM},
  RIGHT: {left: +QUANTUM},
  UP: {top: -QUANTUM},
  DOWN: {top: +QUANTUM},
}

class Tank extends React.PureComponent<{}, State> {
  private onPress$: Subject<number> = new Subject()

  state: State = {
    top: 0,
    left: 0,
    direction: 'DOWN'
  }

  constructor(props: {}){
    super(props)
    this.onPress$.pipe(
      throttle(() => interval(UPDATE_TIME)),
    ).subscribe((keyCode) => this.move(keyCode))
  }

  private move(keyCode: number){
    const action = keysActions[KEYS_CODES[keyCode]]
    const direction = KEYS_CODES[keyCode]
    this.setState(prevState => {
      return {
        top: action.top ? prevState.top + action.top : prevState.top,
        left: action.left ? prevState.left + action.left : prevState.left,
        direction
      }
    })
  }

  public componentDidMount() {
    document.addEventListener('keydown', (event) => {
      this.onPress$.next(event.which)
    });
  }

  render() {
    return (
      <div style={{
        ...styles.tank,
        transform: `translateX(${this.state.left}px) translateY(${this.state.top}px)`,
        transition: '1s linear'
        // transform: `translateY(${this.state.top}px)`
      }} >
        <Trunk direction={this.state.direction}/>

      </div>
    )
  }


}

export default Tank
