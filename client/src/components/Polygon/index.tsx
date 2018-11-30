import * as React from "react";
import styles from './polygonStyles'
import {coordsToPixels} from '../../utils/helpers';
import {IGameState, IBullet, ICollision, IWater} from '../../services/socketService/interfaces';
import Tank from './Tank';
import Bullet from './Bullet';
import Explosion from './Explosion';
import Water from './Water';
import Brick from './Brick';

interface Props {
    gameState: IGameState
};

interface State {
    explodedBulletsIds: string[]
};

class Polygon extends React.Component<Props, State> {

    private polygonStyles: any;

    constructor(props: Props) {
        super(props)
        this.onExplosion = this.onExplosion.bind(this)
        this.state = {
            explodedBulletsIds: []
        }
    }

    componentDidMount() {

        this.polygonStyles = Object.assign({}, styles.polygon);
        this.polygonStyles.width = coordsToPixels(this.props.gameState.config.x);
        this.polygonStyles.height = coordsToPixels(this.props.gameState.config.y);
    }

    private onExplosion(collision: ICollision) {
        this.setState(prevState => {
            return {
                explodedBulletsIds: [
                    ...prevState.explodedBulletsIds,
                    collision.bulletId
                ]
            }
        })
    }

    private getBullets() {
        return this.props.gameState.bullets
            .filter((bullet: IBullet) => {
                return this.state.explodedBulletsIds.indexOf(bullet.id) === -1
            })
            .map((bullet: IBullet) => {
                return <Bullet key={bullet.id} bullet={bullet} />
            })
    }

    render() {
        return (
            <div style={this.polygonStyles}>
                {
                    Object.keys(this.props.gameState.tanks).map(id => {
                        return <Tank key={id} tank={this.props.gameState.tanks[id]} />
                    })
                }
                {this.getBullets()}

                {
                    Object.keys(this.props.gameState.environment.water).map((id: string) => {
                        return <Water
                            key={id}
                            water={this.props.gameState.environment.water[id]}>
                        </Water>
                    })
                }

                {
                    Object.keys(this.props.gameState.environment.bricks).map((id: string) => {
                        return <Brick
                            key={id}
                            brick={this.props.gameState.environment.bricks[id]}>
                        </Brick>
                    })
                }

                {
                    this.props.gameState.collisions.map((collision: ICollision) => {
                        return <Explosion
                            key={collision.bulletId}
                            onExplosion={this.onExplosion}
                            collision={collision}
                        />
                    })
                }
            </div>
        );
    }
}

export default Polygon;
