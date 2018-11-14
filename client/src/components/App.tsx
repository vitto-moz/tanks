import * as React from "react";
import socketService from '../services/socketService';
import Polygon from './Polygon';

export type direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface ITank {
  id: string
  name: string
  hp: number
  x: number
  y: number
  direction: direction
}

export interface ITanks {
  [index: string]: ITank
}

interface GameState extends ITanks {}

class App extends React.Component<{}, GameState> {
    state: GameState = {};

    constructor(props: {}) {
      super(props)
      socketService.onUpdate((gameState: ITanks) => {
        this.setState(gameState)
      })
    }

    render() {
      return (
        [
          <Polygon gameState={this.state} key="Polygon" />,
        ]
      )
    }

  }

export default App
