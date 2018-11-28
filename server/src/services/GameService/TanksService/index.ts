import {ITanks, Direction, Directions, ITank} from '../interfaces';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

interface ITanksMovements {
    [index: string]: Direction
}

const TANK_MOVE_QUANTUM = 1

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
                        possibleTank.y = tanks[id].y - TANK_MOVE_QUANTUM
                        break
                    case DIRECTIONS.DOWN:
                        possibleTank.y = tanks[id].y + TANK_MOVE_QUANTUM
                        break
                    case DIRECTIONS.LEFT:
                        possibleTank.x = tanks[id].x - TANK_MOVE_QUANTUM
                        break
                    case DIRECTIONS.RIGHT:
                        possibleTank.x = tanks[id].x + TANK_MOVE_QUANTUM
                        break
                }
            }
        }
        return possibleTank
    }

}

const tanksService = new TanksService()
export default tanksService