import {Tank} from './tank.model';
import {ITanks, Direction, Directions, ITank, IGameState} from './interfaces';
import GAME_STATE from './config';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

const UPDATING_INTERVAL = 1000
const MOVE_QUANTUM = 1

class GameService {
    public tanks: ITanks = {}
    public possibleTanks: ITanks = {}
    public gameState: IGameState = GAME_STATE
    public tanksMovements: {[index: string]: Direction} = {}

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            // console.log('setInterval this.tanks ', this.tanks)
            this.moveTanks()
            emitUpdate(this.gameState)
        }, UPDATING_INTERVAL
        )
    }

    public addTank(name: string, id: string): string {
        this.tanks[id] = new Tank(name, id)
        this.possibleTanks[id] = new Tank(name, id)
        console.log('this.tanks ==> ', this.tanks)
        return id
    }

    public updateTank(tank: ITank) {
        this.tanks[tank.id] = tank
    }

    private moveTanks() {
        if (this.tanksMovements) {
            Object.keys(this.tanksMovements).map(id => {
                this.initateTankMove(id, this.tanksMovements[id])
            })
        }
        this.checkObstacles()
        this.gameState.tanks = this.tanks
        this.tanksMovements = {}
    }

    public registerMovement(id: string, direction: Direction) {
        this.tanksMovements[id] = direction
    }

    public initateTankMove(id: string, direction: Direction) {
        if (this.tanks[id]) {
            this.tanks[id].direction = direction
            switch (direction) {
                case DIRECTIONS.UP:
                    this.possibleTanks[id].y = this.tanks[id].y - MOVE_QUANTUM
                    break
                case DIRECTIONS.DOWN:
                    this.possibleTanks[id].y = this.tanks[id].y + MOVE_QUANTUM
                    break
                case DIRECTIONS.LEFT:
                    this.possibleTanks[id].x = this.tanks[id].x - MOVE_QUANTUM
                    break
                case DIRECTIONS.RIGHT:
                    this.possibleTanks[id].x = this.tanks[id].x + MOVE_QUANTUM
                    break
            }
        }
    }

    private checkObstacles() {
        Object.keys(this.possibleTanks)
            .map(currentTankId => {
                console.log('currentTankId ', currentTankId)
                return {
                    id: currentTankId,
                    obstacles: Object.keys(this.possibleTanks).map((tankToCheckId) => {
                        if (tankToCheckId !== currentTankId) {
                            return {
                                id: currentTankId,
                                obstacle: this.possibleTanks[tankToCheckId].x === this.possibleTanks[currentTankId].x
                                    && this.possibleTanks[tankToCheckId].y === this.possibleTanks[currentTankId].y
                            }
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
                console.log('tankObstacle ', tankObstacle)
                if (!tankObstacle.obstacle) {
                    console.log('tankObstacle.obstacle ', tankObstacle.obstacle)
                    this.tanks[tankObstacle.id] = this.possibleTanks[tankObstacle.id]
                }
            })
    }

}

const gameService = new GameService()
export default gameService