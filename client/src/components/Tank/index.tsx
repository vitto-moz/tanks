import * as React from "react";
import styles from './tankStyles'
import {Subject, interval} from 'rxjs'
import {throttle} from 'rxjs/operators'
import Trunk from './Trunk';
import Bullet from './Bullet';
import {ITank} from '../../services/socketService/interfaces';
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

export interface IBullet {
    onFly: boolean;
    direction: direction;
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

    private onKeyPress$: Subject<number> = new Subject();
    private tankStyles: any;

    state: State = {
        top: 0,
        left: 0,
        direction: 'DOWN',
        fire: false,
        bullets: []
    };

    componentDidMount() {

        this.tankStyles = Object.assign({}, styles.tank);
        this.tankStyles.width = coordsToPixels(1);
        this.tankStyles.height = coordsToPixels(1);
    }

    render() {
        return (
            <div style={{
                ...this.tankStyles,
                transform: `translateX(${coordsToPixels(this.props.tank.x)}px) translateY(${coordsToPixels(this.props.tank.y)}px)`,
                transition: '1s linear'
            }}>
                <Trunk direction={this.props.tank.direction}/>
            </div>
        );
    }
}

export default Tank
