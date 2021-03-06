import * as React from "react";
import styles from './tankStyles'
import {IBullet, ITank, Direction, ICoordinate} from '../../../services/socketService/interfaces';
import {coordsToPixels} from '../../../utils/helpers';
import Health from './Health';
import Star from './Star';

export type direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'SPACE'

export interface IKeysCodes {
    [index: string]: direction;
}

export interface IKeyAction {
    [index: string]: number;
}

export interface IKeyActions {
    [index: string]: IKeyAction;
}

const KEYS_CODES: IKeysCodes = {
    37: 'LEFT',
    39: 'RIGHT',
    38: 'UP',
    40: 'DOWN',
    32: 'SPACE'
};

const QUANTUM = 100;
const UPDATE_TIME = 999;

const keysActions: IKeyActions = {
    LEFT: {left: -QUANTUM},
    RIGHT: {left: +QUANTUM},
    UP: {top: -QUANTUM},
    DOWN: {top: +QUANTUM},
};

interface Props {
    tank: ITank,
    addFinishExplosion: (cordinates: {x: number, y: number}) => void
}

interface State {
    top: number
    left: number
    deg: number
    direction: direction
    fire: boolean
    bullets: IBullet[]
};

class Tank extends React.PureComponent<Props, State> {

    private tankStyles: any;

    state: State = {
        top: 0,
        left: 0,
        deg: 0,
        direction: 'DOWN',
        fire: false,
        bullets: []
    };

    constructor(props: Props) {
        super(props)
        this.onFireFinish = this.onFireFinish.bind(this)
    }

    componentDidMount() {
        this.tankStyles = Object.assign({}, styles.tank);
        this.tankStyles.width = coordsToPixels(1);
        this.tankStyles.height = coordsToPixels(1);
    }

    componentWillReceiveProps(props: Props) {
        if (props.tank.fire) {
            this.onFire(props.tank.direction)
        }

        if (props.tank.direction) {
            let targetDeg = 0;

            switch (props.tank.direction) {
                case 'UP':
                    targetDeg = 0;
                    break;
                case 'DOWN':
                    targetDeg = -180;
                    break;
                case 'LEFT':
                    targetDeg = -90;
                    break;
                case 'RIGHT':
                    targetDeg = 90;
                    break;
            }

            let rotateDeg = targetDeg - this.state.deg;

            if (rotateDeg > 180) rotateDeg = rotateDeg - 360;
            if (rotateDeg < -180) rotateDeg = rotateDeg + 360;

            // console.log(props.tank.direction);
            // console.log('state:' + this.state.deg);
            // console.log('target:' + targetDeg);
            // console.log('rotate:' + rotateDeg);

            if (rotateDeg !== 0) {
                this.setState({
                    deg: this.state.deg + rotateDeg
                });
            }
        }
    }

    private onFire(direction: Direction) {
        this.setState(prevState => {
            const bullets = [...prevState.bullets]
            // bullets.push({onFly: true, direction})
            return {fire: true, bullets}
        }, () => {
            setTimeout(() => {
                this.setState(prevState => {
                    const bullets = prevState.bullets
                    // bullets[bullets.length - 1] = {onFly: false, direction}
                    return {bullets}
                })
            }, 3000)
        })
    }

    public componentWillUnmount() {
        const {x, y} = this.props.tank
        this.props.addFinishExplosion({x, y})
    }

    private onFireFinish(index: number) {
        this.setState(prevState => {
            const bullets = [...prevState.bullets]
            const bulletOnFinish = {...bullets[index]}
            // bulletOnFinish.onFly = false
            bullets[index] = bulletOnFinish
            return {bullets}

        })
    }

    private getStars() {
        const stars = []
        for (let i = 0;i < this.props.tank.score;i++) {
            stars.push(<Star key={i} />)
        }
        return stars
    }

    private getTankPositionStyles() {
        return {
            transform: `translateX(${coordsToPixels(this.props.tank.x)}px) translateY(${coordsToPixels(this.props.tank.y)}px)`
        }
    }

    render() {
        return (
            <div style={{
                transition: 'all 0.5s linear, rotate 0s linear 0.5s',
                ...this.getTankPositionStyles(),
                ...styles.tankWrap
            }}>
                
                <Health
                    hp={this.props.tank.hp}
                    teamId={this.props.tank.teamId}
                />
                <div style={{
                    ...this.tankStyles,
                    transform: `rotate(${this.state.deg}deg)`,
                    transition: 'all 0.5s linear, rotate 0s linear 0.5s',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${this.props.tank.skinUrl})`,
                }}>
                </div>
                <span style={styles.name}>{this.props.tank.name}</span>

                <div style={styles.starsWrap}>
                    {this.getStars()}
                </div>
            </div>
        );
    }
}

export default Tank
