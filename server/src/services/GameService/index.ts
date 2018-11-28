import {Tank} from './tank.model';
import {ITanks, Direction, Directions, ITank, IGameState, IBullet} from './interfaces';
import GAME_STATE from './config';
import tanksService from './TanksService';
import bulletsService from './BulletsService';
import obstacleService from './ObstacleService';
import randomId from '../../utils/randomId';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

export interface ITanksMovements {
    [index: string]: Direction
}

export interface ITanksBullets {
    [index: string]: IBullet
}

const UPDATING_INTERVAL = 1000

class GameService {
    public gameState: IGameState = GAME_STATE
    public tanksMovements: ITanksMovements = {}
    public tanksBullets: ITanksBullets = {}

    constructor() {
        this.changeGameState = this.changeGameState.bind(this)
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

    private changeGameState(tanksMovements: ITanksMovements, newTanksBullets: ITanksBullets, tanks: ITanks) {
        const possibleTanks = tanksService.getPossibleTanks(tanksMovements, tanks)
        const checkedTanks = obstacleService.getCheckedTanks(possibleTanks, tanks)
        this.gameState.tanks = checkedTanks
        this.gameState.bullets =
            bulletsService.getMovedBullets(
                this.gameState.bullets,
                newTanksBullets
            )
    }

    private clean() {
        this.tanksMovements = {}
        this.tanksBullets = {}
        Object.keys(this.gameState.tanks).map((tankId: string) => {
            return this.gameState.tanks[tankId].fire = false
        })
    }

    public registerMovement(id: string, direction: Direction) {
        this.tanksMovements[id] = direction
    }

    public registerBullet(tankId: string) {
        this.tanksBullets[tankId] = this.addBullet(tankId)
    }

    public addBullet(tankId: string): IBullet {
        return {
            id: randomId(),
            tankId,
            x: this.gameState.tanks[tankId].x,
            y: this.gameState.tanks[tankId].y,
            new: true,
            direction: this.gameState.tanks[tankId].direction
        }
    }


}

const gameService = new GameService()
export default gameService