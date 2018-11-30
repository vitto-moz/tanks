import {IGameState} from './interfaces';

const GAME_STATE: IGameState = {
    tanks: {},
    bullets: [],
    collisions: [],
    environment: {
        bricks: {},
        water: {},
    },
    config: {
        x: 100,
        y: 100,
    }
}

export default GAME_STATE