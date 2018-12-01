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
        x: 50,
        y: 50,
    }
}

export default GAME_STATE