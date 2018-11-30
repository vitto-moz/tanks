import {ITanks, Direction, Directions, ITank, ICollision} from '../interfaces';
import CONSTANTS from '../../../constants';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

interface ITanksMovements {
    [index: string]: Direction
}

class TanksService {

    constructor() {
    }

    public getPossibleTanks(tanksMovements: ITanksMovements, tanks: ITanks): ITanks {
        const possibleTanks: ITanks = {}
        Object.keys(tanksMovements).map(id => {
            possibleTanks[id] = this.getPossibleTankPosition(id, tanksMovements[id], tanks)
        })
        return {...tanks, ...possibleTanks}
    }

    public getPossibleTankPosition(id: string, direction: Direction, tanks: ITanks): ITank {
        const possibleTank: ITank = {...tanks[id]}
        if (tanks[id]) {
            if (tanks[id].direction !== direction) {
                possibleTank.direction = direction
            } else {
                switch (direction) {
                    case DIRECTIONS.UP:
                        possibleTank.y = tanks[id].y - CONSTANTS.TANK_MOVE_QUANTUM
                        break
                    case DIRECTIONS.DOWN:
                        possibleTank.y = tanks[id].y + CONSTANTS.TANK_MOVE_QUANTUM
                        break
                    case DIRECTIONS.LEFT:
                        possibleTank.x = tanks[id].x - CONSTANTS.TANK_MOVE_QUANTUM
                        break
                    case DIRECTIONS.RIGHT:
                        possibleTank.x = tanks[id].x + CONSTANTS.TANK_MOVE_QUANTUM
                        break
                }
            }
        }
        return possibleTank
    }

    public getInjuredTanks(tanks: ITanks, collisions: ICollision[]): ITanks {
        const injuredTanks = {...tanks}
        collisions.map((collision: ICollision) => {
            if (!collision.done && injuredTanks[collision.objectId]) {
                injuredTanks[collision.objectId].hp = injuredTanks[collision.objectId].hp - 20
            }
        })
        return injuredTanks
    }

}

const tanksService = new TanksService()
export default tanksService