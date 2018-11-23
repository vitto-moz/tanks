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
    public gameState: IGameState = GAME_STATE
    public tanksMovements: ITanksMovements = {}
    public tanksFires: string[] = []

    constructor() {
        this.moveTanks = this.moveTanks.bind(this)
        this.getCheckedTanks = this.getCheckedTanks.bind(this)
    }

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            this.moveTanks(this.tanksMovements, this.tanksFires, this.gameState.tanks)
            emitUpdate(this.gameState)
            this.clean()
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

    private moveTanks(tanksMovements: ITanksMovements, tanksFires: string[], tanks: ITanks) {
        const possibleTanks = this.getPossibleTanks(tanksMovements, tanks)
        const checkedTanks = this.getCheckedTanks(possibleTanks, tanks)
        const tanksWithFires = this.getTanksWithFire(checkedTanks, tanksFires)
        console.log('tanksWithFires ', tanksWithFires)
        this.gameState.tanks = tanksWithFires
        // this.gameState.tanks = checkedTanks
    }

    private clean() {
        this.tanksMovements = {}
        this.tanksFires = []
        Object.keys(this.gameState.tanks).map((tankId: string) => {
            return this.gameState.tanks[tankId].fire = false
        })
    }

    private getTanksWithFire(checkedTanks: ITanks, tanksFire: string[]): ITanks {
        tanksFire.map(tankId => {
            checkedTanks[tankId].fire = true
        })
        console.log('checkedTanks ', checkedTanks)
        return checkedTanks
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
        return possibleTank
    }

    public fire(id: string) {
        this.tanksFires.push(id)
    }

    private getCheckedTanks(possibleTanks: ITanks, tanks: ITanks): ITanks {
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
                return {
                    id: tankObstacle.id,
                    obstacle: tankObstacle.obstacles.length !== 0
                        ? tankObstacle.obstacles.reduce((aggregatedObstacle, obstacle) => aggregatedObstacle || obstacle)
                        : false
                }
            })
            .map(tankObstacle => {
                if (tankObstacle.obstacle) {
                    possibleTanks[tankObstacle.id] = {
                        ...tanks[tankObstacle.id],
                        direction: possibleTanks[tankObstacle.id].direction
                    }
                }
            })

        return possibleTanks
    }

}

const gameService = new GameService()
export default gameService