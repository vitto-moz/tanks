import * as React from "react";
import styles from './tankStyles'
import Trunk from './Trunk';
import Bullet from './Bullet';
import {ITank, IBullet, Direction} from '../../services/socketService/interfaces';
import {coordsToPixels} from "../../utils/helpers";

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
    tank: ITank
};

interface State {
    top: number
    left: number
    direction: direction
    fire: boolean
    bullets: IBullet[]
};

class Tank extends React.PureComponent<Props, State> {

    private tankStyles: any;

    state: State = {
        top: 0,
        left: 0,
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
    }

    private onFire(direction: Direction) {
        this.setState(prevState => {
            const bullets = [...prevState.bullets]
            bullets.push({onFly: true, direction})
            return {fire: true, bullets}
        }, () => {
            setTimeout(() => {
                this.setState(prevState => {
                    const bullets = prevState.bullets
                    bullets[bullets.length - 1] = {onFly: false, direction}
                    return {bullets}
                })
            }, 3000)
        })
    }

    private onFireFinish(index: number) {
        this.setState(prevState => {
            const bullets = [...prevState.bullets]
            const bulletOnFinish = {...bullets[index]}
            bulletOnFinish.onFly = false
            bullets[index] = bulletOnFinish
            return {bullets}

        })
    }

    private getTankStyles() {
        switch (this.props.tank.direction) {
            case 'UP':
                return {
                    transform: `translateX(${coordsToPixels(this.props.tank.x)}px) translateY(${coordsToPixels(this.props.tank.y)}px) rotate(${0}deg)`
                }
            case 'DOWN':
                return {
                    transform: `translateX(${coordsToPixels(this.props.tank.x)}px) translateY(${coordsToPixels(this.props.tank.y)}px) rotate(${180}deg)`
                }
            case 'LEFT':
                return {
                    transform: `translateX(${coordsToPixels(this.props.tank.x)}px) translateY(${coordsToPixels(this.props.tank.y)}px) rotate(${-90}deg)`
                }
            case 'RIGHT':
                return {
                    transform: `translateX(${coordsToPixels(this.props.tank.x)}px) translateY(${coordsToPixels(this.props.tank.y)}px) rotate(${90}deg)`
                }
        }
    }

    render() {
        return (
            <div style={{
                ...this.tankStyles,
                transition: 'all 1s linear, rotate 0s linear 0s',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${this.props.tank.skinUrl})`,
                ...this.getTankStyles()
            }}>
                {/*<Trunk direction={this.props.tank.direction} />*/}
                {this.state.bullets.map((bullet, index) => {
                    return bullet.onFly
                        ? <Bullet
                            key={index}
                            index={index}
                            direction={bullet.direction}
                            onFly={bullet.onFly}
                            onFinish={this.onFireFinish}
                        />
                        : null
                })}
            </div>
        );
    }
}

export default Tank
