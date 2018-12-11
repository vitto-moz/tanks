import * as React from "react";
import styles from './polygonStyles'
import {coordsToPixels, randomId} from '../../utils/helpers';
import {IGameState, IBullet, ICollision, IWater, ICoordinate, ICoordinates} from '../../services/socketService/interfaces';
import Tank from './Tank';
import Bullet from './Bullet';
import Explosion from './Explosion';
import ExplosionFinish from './ExplosionFinish';
import Water from './Water';
import Brick from './Brick';

interface Props {
    gameState: IGameState
};

interface State {
    explodedBulletsIds: string[]
    finishExplosions: ICoordinates
};

class Polygon extends React.Component<Props, State> {

    private polygonStyles: any;

    constructor(props: Props) {
        super(props)
        this.onExplosion = this.onExplosion.bind(this)
        this.addFinishExplosion = this.addFinishExplosion.bind(this)
        this.removeFinishExplosion = this.removeFinishExplosion.bind(this)
        this.state = {
            explodedBulletsIds: [],
            finishExplosions: {}
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

    private addFinishExplosion(coordinate: {x: number, y: number}) {
        const id = randomId()
        this.setState(prevState => {
            return {
                finishExplosions: {
                    ...prevState.finishExplosions,
                    [id]: {...coordinate, id}
                }
            }
        })
    }

    private removeFinishExplosion(id: string) {
        const finishExplosions = {... this.state.finishExplosions}
        delete finishExplosions[id]
        this.setState({finishExplosions})
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


                {this.getBullets()}

                {
                    Object.keys(this.props.gameState.tanks).map(id => {
                        return <Tank
                            key={id}
                            tank={this.props.gameState.tanks[id]}
                            addFinishExplosion={this.addFinishExplosion}
                        />
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
                {
                    Object.keys(this.state.finishExplosions).map((id: string) => {
                        return <ExplosionFinish
                            key={id}
                            coordinate={this.state.finishExplosions[id]}
                            removeFinishExplosion={this.removeFinishExplosion}
                        />
                    })
                }
            </div>
        );
    }
}

export default Polygon;
