import {Tank} from './tank.model';
import {
    ITanks,
    Direction,
    Directions,
    ITank,
    IGameState,
    IBullet,
    ICollision,
    IGameSpeed,
    TeamId
} from './interfaces';
import GAME_STATE from './config';
import tanksService from './TanksService';
import bulletsService from './BulletsService';
import obstacleService from './ObstacleService';
import randomId from '../../utils/randomId';
import mapBuilder from './MapBuilder';
import map from './Map';

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

const UPDATING_INTERVAL = 250

class GameService {
    public gameState: IGameState = GAME_STATE
    public tanksMovements: ITanksMovements = {}
    public tanksBullets: ITanksBullets = {}

    constructor() {
        this.changeGameState = this.changeGameState.bind(this)
        this.gameState.environment = mapBuilder.getMapEnvironment(map)
    }

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon
        let tick = 0
        setInterval(() => {
            this.updateDecider(tick)
            emitUpdate(this.gameState)
            this.clean()
            tick++
        }, UPDATING_INTERVAL
        )
    }

    private updateDecider(tick: number) {
        const medium = tick % 2 === 0
        const slow = tick % 20 === 0
        this.changeGameState(
            medium ? this.tanksMovements : null,
            this.tanksBullets,
            this.gameState.tanks,
            {slow, medium, fast: true}
        )
    }

    public addTank(name: string, id: string, teamId: TeamId): string {
        this.gameState.tanks[id] = new Tank(name, id, teamId)
        return id
    }

    public updateTank(tank: ITank) {
        this.gameState.tanks[tank.id] = tank
    }

    private getUpdatedTanks(tanksMovements: ITanksMovements, tanks: ITanks) {
        const possibleTanks = tanksService.getPossibleTanks(tanksMovements, tanks)
        const checkedTanksToEachOther = obstacleService.getCheckedTanksToEachOther(possibleTanks, tanks)
        const checkedTanksToEnvironment = obstacleService.checkTanksToEnvironment(
            checkedTanksToEachOther,
            [
                ...Object.values(this.gameState.environment.water),
                ...Object.values(this.gameState.environment.bricks)
            ],
            tanks
        )
        return checkedTanksToEnvironment
    }

    private changeGameState(
        tanksMovements: ITanksMovements | null,
        newTanksBullets: ITanksBullets,
        tanks: ITanks,
        speed: IGameSpeed
    ) {

        const movedTanks = tanksMovements
            ? this.getUpdatedTanks(tanksMovements, tanks) : this.gameState.tanks

        const movedBullets =
            bulletsService.getMovedBullets(
                this.gameState.bullets,
                newTanksBullets
            )

        const objectsToIntersect = [
            ...Object.values(movedTanks),
            ...Object.values(this.gameState.environment.bricks)
        ]

        const collisions = [
            ...this.gameState.collisions.map((collision: ICollision) => ({...collision, done: true})),
            ...bulletsService.getBulletsCollisions(objectsToIntersect, movedBullets)
        ]

        this.gameState.tanks = tanksService.getInjuredTanks(movedTanks, collisions)
        this.gameState.bullets = bulletsService.ridOfExploidedBullets(movedBullets, collisions)

        this.gameState.collisions = speed.slow
            ? collisions.filter((collisions: ICollision) => {
                return !collisions.done
            })
            : collisions
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
            direction: this.gameState.tanks[tankId].direction,
            exploided: false
        }
    }


}

const gameService = new GameService()
export default gameService