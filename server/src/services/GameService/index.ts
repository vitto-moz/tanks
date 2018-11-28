import {Tank} from './tank.model';
import {ITanks, Direction, Directions, ITank, IGameState, IBullet} from './interfaces';
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
const TANK_MOVE_QUANTUM = 1
const BULLET_MOVE_QUANTUM = 3

class GameService {
    public gameState: IGameState = GAME_STATE
    public tanksMovements: ITanksMovements = {}
    public tanksBullets: IBullet[] = []

    constructor() {
        this.moveTanks = this.moveTanks.bind(this)
        this.getCheckedTanks = this.getCheckedTanks.bind(this)
    }

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            this.moveTanks(this.tanksMovements, this.tanksBullets, this.gameState.tanks)
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

    private moveTanks(tanksMovements: ITanksMovements, tanksFires: IBullet[], tanks: ITanks) {
        const possibleTanks = this.getPossibleTanks(tanksMovements, tanks)
        const checkedTanks = this.getCheckedTanks(possibleTanks, tanks)
        const tanksWithFires = this.getTanksWithFire(checkedTanks, tanksFires)
        // console.log('tanksWithFires ', tanksWithFires)
        this.gameState.tanks = tanksWithFires
        this.gameState.bullets = this.getMovedBullets()
    }

    private clean() {
        this.tanksMovements = {}
        // this.tanksBullets = []
        Object.keys(this.gameState.tanks).map((tankId: string) => {
            return this.gameState.tanks[tankId].fire = false
        })
    }

    private getTanksWithFire(checkedTanks: ITanks, tanksFire: IBullet[]): ITanks {
        tanksFire.map(fire => {
            checkedTanks[fire.tankId].fire = true
        })
        // console.log('checkedTanks ', checkedTanks)
        return checkedTanks
    }

    public addBullet(tankId: string) {
        this.gameState.bullets.push({
            tankId,
            x: this.gameState.tanks[tankId].x,
            y: this.gameState.tanks[tankId].y,
            new: true,
        })
    }

    private getMovedBullets(): IBullet[] {
        const tanksBullets = this.gameState.bullets.map((bullet) => {
            return bullet.new ? {...bullet, new: false} : this.moveBullet(bullet)
        })
        return tanksBullets
    }

    private moveBullet(bullet: IBullet): IBullet {
        const direction = this.gameState.tanks[bullet.tankId].direction
        console.log('direction ', direction)
        switch (direction) {
            case DIRECTIONS.UP:
                return {...bullet, y: bullet.y - BULLET_MOVE_QUANTUM}
            case DIRECTIONS.DOWN:
                return {...bullet, y: bullet.y + BULLET_MOVE_QUANTUM}
            case DIRECTIONS.LEFT:
                return {...bullet, x: bullet.x - BULLET_MOVE_QUANTUM}
            case DIRECTIONS.RIGHT:
                return {...bullet, x: bullet.x + BULLET_MOVE_QUANTUM}
            default: return bullet
        }
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