import {ITanksBullets} from './../index';
import {ITanks, Directions, ITank, IBullet} from '../interfaces';
import CONSTANTS from '../../../constants';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

interface ICollision {
    bulletId: string
    objectId: string
    x: number
    y: number
    active: boolean
}

export interface IBulletHitPoint {
    x: number
    y: number
}

export interface IObjectToIntersect {
    id: string
    x: number
    y: number
}


class BulletsService {

    constructor() {
    }

    public getMovedBullets(bullets: IBullet[], newTanksBullets: ITanksBullets): IBullet[] {
        const aNewTanksBullets = Object.values(newTanksBullets)
        const tanksBullets = [...bullets, ...aNewTanksBullets]
            .map((bullet) => {
                return bullet.new
                    ? {...bullet, new: false}
                    : {...this.moveBullet(bullet)}
                // return this.moveBullet(bullet)
            })
        return tanksBullets
    }


    private moveBullet(bullet: IBullet): IBullet {
        const moveQuantum = bullet.new
            ? CONSTANTS.TANK_MOVE_QUANTUM : CONSTANTS.BULLET_MOVE_QUANTUM
        switch (bullet.direction) {
            case DIRECTIONS.UP:
                return {...bullet, y: bullet.y - moveQuantum}
            case DIRECTIONS.DOWN:
                return {...bullet, y: bullet.y + moveQuantum}
            case DIRECTIONS.LEFT:
                return {...bullet, x: bullet.x - moveQuantum}
            case DIRECTIONS.RIGHT:
                return {...bullet, x: bullet.x + moveQuantum}
            default: return bullet
        }
    }

    public getBulletsCollisions(
        objectsToIntersect: IObjectToIntersect[],
        bullets: IBullet[]
    ): ICollision[] {
        return bullets
            .map((bullet: IBullet) => {
                return this.getBulletCollisions(bullet, objectsToIntersect)
            })
            .reduce((acc, val) => acc.concat(val), [])
            .filter((collision: ICollision) => {
                const bullet = bullets.filter(bullet => bullet.id === collision.bulletId)[0]
                return collision.objectId !== bullet.tankId
            })

    }

    private getBulletCollisions(bullet: IBullet, objectsToIntersect: IObjectToIntersect[]): ICollision[] {
        return objectsToIntersect.map((object: IObjectToIntersect): ICollision[] => {
            return this.getBulletHitLine(bullet)
                .map((bulletHitPoint: IBulletHitPoint): ICollision => {
                    return {
                        bulletId: bullet.id,
                        objectId: object.id,
                        x: bulletHitPoint.x,
                        y: bulletHitPoint.y,
                        active: bulletHitPoint.x === object.x && bulletHitPoint.y === object.y
                    }
                }).filter((collision: ICollision) => collision.active)
        }).reduce((acc, val) => acc.concat(val), [])
    }

    private getBulletHitLine(bullet: IBullet): IBulletHitPoint[] {
        let bulletHitLine: IBulletHitPoint[] = []
        for (let i = 0;i < 3;i++) {
            bulletHitLine.push(this.getBulletHitPoint(bullet, i))
        }
        return bulletHitLine
    }

    private getBulletHitPoint(bullet: IBullet, step: number): IBulletHitPoint {
        switch (bullet.direction) {
            case DIRECTIONS.UP:
                return {x: bullet.x, y: bullet.y - step}
            case DIRECTIONS.DOWN:
                return {x: bullet.x, y: bullet.y + step}
            case DIRECTIONS.LEFT:
                return {x: bullet.x - step, y: bullet.y}
            case DIRECTIONS.RIGHT:
                return {x: bullet.x + step, y: bullet.y}
            default: return {x: bullet.x, y: bullet.y}
        }
    }

}

const bulletsService = new BulletsService()
export default bulletsService