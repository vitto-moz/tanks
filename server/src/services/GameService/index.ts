import {Tank} from './tank.model';
import {ITanks, Direction, Directions, ITank, IGameState} from './interfaces';
import GAME_STATE from './config';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

interface ITanksMovements {
    [index: string]: Direction
}

const UPDATING_INTERVAL = 1000
const MOVE_QUANTUM = 1

class GameService {
    // public tanks: ITanks = {}
    // public possibleTanks: ITanks = {}
    public gameState: IGameState = GAME_STATE
    public tanksMovements: ITanksMovements = {}

    constructor() {
        this.moveTanks = this.moveTanks.bind(this)
        this.getCheckedTanks = this.getCheckedTanks.bind(this)
    }

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            // console.log('setInterval this.tanks ', this.tanks)
            this.moveTanks(this.tanksMovements, this.gameState.tanks)
            emitUpdate(this.gameState)
        }, UPDATING_INTERVAL
        )
    }

    public addTank(name: string, id: string): string {
        this.gameState.tanks[id] = new Tank(name, id)
        return id
    }

    public updateTank(tank: ITank) {
        this.gameState.tanks[tank.id] = tank
    }

    private moveTanks(tanksMovements: ITanksMovements, tanks: ITanks) {
        // console.log('tanks ', tanks)
        const possibleTanks = this.getPossibleTanks(tanksMovements, tanks)
        // console.log('possibleTanks ', possibleTanks)
        const checkedTanks = this.getCheckedTanks(possibleTanks)
        // console.log('checkedTanks ', checkedTanks)
        this.gameState.tanks = {...tanks, ...checkedTanks}
        this.tanksMovements = {}
    }

    private getPossibleTanks(tanksMovements: ITanksMovements, tanks: ITanks): ITanks {
        const possibleTanks: ITanks = {}
        Object.keys(tanksMovements).map(id => {
            possibleTanks[id] = this.getPossibleTankPosition(id, tanksMovements[id], tanks)
        })
        return {...tanks, ...possibleTanks}
    }

    public registerMovement(id: string, direction: Direction) {
        this.tanksMovements[id] = direction
    }

    public getPossibleTankPosition(id: string, direction: Direction, tanks: ITanks): ITank {
        const possibleTank: ITank = {...tanks[id]}
        if (tanks[id]) {
            possibleTank.direction = direction
            switch (direction) {
                case DIRECTIONS.UP:
                    possibleTank.y = tanks[id].y - MOVE_QUANTUM
                    break
                case DIRECTIONS.DOWN:
                    possibleTank.y = tanks[id].y + MOVE_QUANTUM
                    break
                case DIRECTIONS.LEFT:
                    possibleTank.x = tanks[id].x - MOVE_QUANTUM
                    break
                case DIRECTIONS.RIGHT:
                    possibleTank.x = tanks[id].x + MOVE_QUANTUM
                    break
            }
        }
        console.log('possibleTank ', possibleTank)
        return possibleTank
    }

    private getCheckedTanks(possibleTanks: ITanks): ITanks {
        Object.keys(possibleTanks)
            .map(currentTankId => {
                return {
                    id: currentTankId,
                    obstacles: Object.keys(possibleTanks).map((tankToCheckId) => {
                        if (tankToCheckId !== currentTankId) {
                            return possibleTanks[tankToCheckId].x === possibleTanks[currentTankId].x
                                && possibleTanks[tankToCheckId].y === possibleTanks[currentTankId].y
                        } else {
                            return null
                        }
                    }).filter(tankObstacle => tankObstacle !== null)
                }
            })
            .map((tankObstacle) => {
                // if no obstacles we set false
                const obstacle = {
                    id: tankObstacle.id,
                    obstacle: tankObstacle.obstacles.length !== 0
                        ? tankObstacle.obstacles.reduce((aggregatedObstacle, obstacle) => aggregatedObstacle || obstacle)
                        : false
                }

                // if (obstacle.obstacle) {
                //     debugger
                //     console.log(this.tanks)
                // }
                return obstacle
            })
            .map(tankObstacle => {
                if (tankObstacle.obstacle) {
                    delete possibleTanks[tankObstacle.id]
                }
            })

        return possibleTanks
    }

}

const gameService = new GameService()
export default gameService