import * as React from "react";
import socketService from '../services/socketService';
import Polygon from './Polygon';
import {IGameState} from "../services/socketService/interfaces";

class App extends React.Component<{}, IGameState> {
    state: GameState = {};

    constructor(props: {}) {

        super(props);

        socketService.onUpdate((gameState: IGameState) => {
            this.setState(gameState);
        });
    }

    componentDidMount() {
        socketService.getGameState((gameState: IGameState) => {
            this.setState(gameState);
        })
    }

    render() {
        return ([<Polygon gameState={this.state} key="Polygon"/>])
    }
}

export default App;
