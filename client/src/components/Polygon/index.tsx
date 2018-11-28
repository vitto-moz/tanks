import * as React from "react";
import styles from './polygonStyles'
import {coordsToPixels} from '../../utils/helpers';
import {IGameState, IBullet, ICollision} from '../../services/socketService/interfaces';
import Tank from './Tank';
import Bullet from './Bullet';
import Explosion from './Explosion';

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
                        return <Tank key={id} tank={this.props.gameState.tanks[id]} />
                    })
                }
                {
                    this.props.gameState.bullets.map((bullet: IBullet) => {
                        return <Bullet key={bullet.id} bullet={bullet} />
                    })
                }
                {
                    this.props.gameState.collisions.map((collision: ICollision) => {
                        return <Explosion key={collision.bulletId} collision={collision} />
                    })
                }
            </div>
        );
    }
}

export default Polygon;
