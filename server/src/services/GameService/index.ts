import {Tank} from './tank.model';
import {ITanks, Direction, Directions, ITank, IGameState, IBullet} from './interfaces';
import GAME_STATE from './config';
import tanksService from './TanksService';
import bulletsService from './BulletsService';

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

class GameService {
    public gameState: IGameState = GAME_STATE
    public tanksMovements: ITanksMovements = {}
    public tanksBullets: IBullet[] = []

    constructor() {
        this.changeGameState = this.changeGameState.bind(this)
        this.getCheckedTanks = this.getCheckedTanks.bind(this)
    }

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            this.changeGameState(this.tanksMovements, this.tanksBullets, this.gameState.tanks)
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

    private changeGameState(tanksMovements: ITanksMovements, tanksFires: IBullet[], tanks: ITanks) {
        const possibleTanks = tanksService.getPossibleTanks(tanksMovements, tanks)
        const checkedTanks = this.getCheckedTanks(possibleTanks, tanks)
        this.gameState.tanks = checkedTanks
        this.gameState.bullets = bulletsService.getMovedBullets(this.gameState.bullets, checkedTanks)
    }

    private clean() {
        this.tanksMovements = {}
        // this.tanksBullets = []
        Object.keys(this.gameState.tanks).map((tankId: string) => {
            return this.gameState.tanks[tankId].fire = false
        })
    }


    public registerMovement(id: string, direction: Direction) {
        this.tanksMovements[id] = direction
    }

    public addBullet(tankId: string) {
        this.gameState.bullets.push({
            tankId,
            x: this.gameState.tanks[tankId].x,
            y: this.gameState.tanks[tankId].y,
            new: true,
        })
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