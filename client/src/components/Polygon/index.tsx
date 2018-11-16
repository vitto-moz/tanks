import * as React from "react";
import styles from './polygonStyles'
import Tank from '../Tank';
import {IGameState} from '../../services/socketService/interfaces';

interface Props {
    gameState: IGameState
};

class Polygon extends React.Component<Props, any> {

    render() {
        return (
            <div style={styles.polygon}>
                {
                    Object.keys(this.props.gameState.tanks).map(id => {
                        return <Tank key={id} tank={this.props.gameState.tanks[id]}/>
                    })
                }
            </div>
        );
    }
}

export default Polygon;
