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
    TeamId,
    IStartPoint
} from './interfaces';
import GAME_STATE from './config';
import tanksService from './TanksService';
import bulletsService from './BulletsService';
import obstacleService from './ObstacleService';
import randomId from '../../utils/randomId';
import mapBuilder from './MapBuilder';

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
    public startPoints: IStartPoint[] = []

    constructor() {
        this.changeGameState = this.changeGameState.bind(this)
        this.gameState.environment = mapBuilder.getMapEnvironment()
        this.startPoints = mapBuilder.getStartPoints()
    }

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon
        let tick = 0
        setInterval(() => {
            const speed = this.getSpeed(tick)
            this.updateDecider(speed)
            emitUpdate(this.gameState)
            this.clean(speed)
            tick++
        }, UPDATING_INTERVAL
        )
    }

    private getSpeed(tick: number): IGameSpeed {
        const medium = tick % 2 === 0
        const slow = tick % 6 === 0
        const slowest = tick % 20 === 0
        return {slowest, slow, medium, fast: true}
    }

    private updateDecider(speed: IGameSpeed) {
        this.changeGameState(
            speed.medium ? this.tanksMovements : null,
            this.tanksBullets,
            this.gameState.tanks,
            speed
        )
    }

    public addTank(name: string, id: string, teamId: TeamId, skinUrl: string): string {
        this.gameState.tanks[id] =
            new Tank(name, id, teamId, skinUrl, this.startPoints, this.gameState.tanks)
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

        if (speed.slow) {

        }
        const movedBullets =
            bulletsService.getMovedBullets(
                this.gameState.bullets,
                speed.slow
                    ? bulletsService.updateBulletStartPosition(newTanksBullets, tanks)
                    : null
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

        this.gameState.collisions = speed.slowest
            ? collisions.filter((collisions: ICollision) => {
                return !collisions.done
            })
            : collisions
    }

    private clean(speed: IGameSpeed) {
        this.tanksMovements = {}
        this.tanksBullets = speed.slow ? {} : this.tanksBullets
        Object.keys(this.gameState.tanks).map((tankId: string) => {
            return this.gameState.tanks[tankId].fire = false
        })
    }

    public registerMovement(id: string, direction: Direction) {
        this.tanksMovements[id] = direction
    }

    public registerBullet(tankId: string) {
        if (this.gameState.tanks[tankId]) {
            this.tanksBullets[tankId] = this.createBullet(tankId)
        }
    }

    public createBullet(tankId: string): IBullet {
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