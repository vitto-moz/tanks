import {IGameState} from './interfaces';

const GAME_STATE: IGameState = {
    tanks: {},
    bullets: [],
    environment: {
        walls: {},
        water: {},
    },
    config: {
        x: 500,
        y: 500,
    }
}

export default GAME_STATE