import * as React from "react";
import styles from './tankStyles'

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

const keysActions: IKeyActions = {
  LEFT_ARROW: {left: -QUANTUM},
  RIGHT_ARROW: {left: +QUANTUM},
  UP_ARROW: {top: -QUANTUM},
  DOWN_ARROW: {top: +QUANTUM},
}

class Tank extends React.PureComponent<{}, State> {

  state: State = {
    top: 0,
    left: 0
  };


  public componentDidMount() {
    document.addEventListener('keydown', (event) => {

      const action = keysActions[KEYS_CODES[event.which]]
      console.log('KEYS_CODES[event.which] ', KEYS_CODES[event.which])
      this.setState(prevState => {
        return {
          top: action.top ? prevState.top + action.top : prevState.top,
          left: action.left ? prevState.left + action.left : prevState.left
        }
      })
    });
  }

  render() {
    return (
      <div style={{
        ...styles.tank,
        transform: `translateX(${this.state.left}px) translateY(${this.state.top}px)`,
        transition: '2s'
        // transform: `translateY(${this.state.top}px)`
      }} />
    );
  }


}

export default Tank
