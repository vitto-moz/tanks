import * as React from "react";
import socketService from '../services/socketService';
import Polygon from './Polygon';
import {IGameState} from "../services/socketService/interfaces";

interface State {
    gameState: IGameState | null,
}

class App extends React.Component<{}, State> {
    state: State = {
        gameState: null,
    };

    constructor(props: {}) {
        super(props);
        socketService.onUpdate((gameState: IGameState) => {
            console.log(gameState);
            this.setState({gameState});
        });
    }

    render() {
        return !!this.state.gameState
            ? <Polygon gameState={this.state.gameState} key="Polygon"/>
            : null
    }
}

export default App;
