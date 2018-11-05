import * as React from "react";
import styles from './tankStyles'
import {Subject, interval} from 'rxjs'
import {throttle} from 'rxjs/operators'

interface State {
  top: number
  left: number
}

export interface IKeysCodes {
  [index: string]: string;
}

export interface IKeyAction {
  [index: string]: number;
}

export interface IKeyActions {
  [index: string]: IKeyAction;
}

const KEYS_CODES: IKeysCodes = {
  37: 'LEFT_ARROW',
  39: 'RIGHT_ARROW',
  38: 'UP_ARROW',
  40: 'DOWN_ARROW'
}

const QUANTUM = 100
const UPDATE_TIME = 1000

const keysActions: IKeyActions = {
  LEFT_ARROW: {left: -QUANTUM},
  RIGHT_ARROW: {left: +QUANTUM},
  UP_ARROW: {top: -QUANTUM},
  DOWN_ARROW: {top: +QUANTUM},
}

class Tank extends React.PureComponent<{}, State> {
  private onPress$: Subject<number> = new Subject()


  state: State = {
    top: 0,
    left: 0
  };

  constructor(props: {}){
    super(props)
    this.onPress$.pipe(
      throttle(() => interval(UPDATE_TIME)),
    ).subscribe((keyCode) => this.move(keyCode))
  }

  private move(keyCode: number){
    const action = keysActions[KEYS_CODES[keyCode]]
    this.setState(prevState => {
      return {
        top: action.top ? prevState.top + action.top : prevState.top,
        left: action.left ? prevState.left + action.left : prevState.left
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
      }} />
    );
  }


}

export default Tank
