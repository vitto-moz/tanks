import * as React from "react";
import styles from './polygonStyles'
import Tank from '../Tank';
import {coordsToPixels} from '../../utils/helpers';
import {IGameState} from '../../services/socketService/interfaces';

interface Props {
    gameState: IGameState
};

class Polygon extends React.Component<Props, any> {

    private polygonStyles: any;

    componentDidMount() {

        this.polygonStyles = Object.assign({}, styles.polygon);
        this.polygonStyles.width = coordsToPixels(this.props.gameState.config.x);
        this.polygonStyles.height = coordsToPixels(this.props.gameState.config.y);
    }

    render() {

        return (
            <div style={this.polygonStyles}>
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
