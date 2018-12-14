import {ITanksBullets, DIRECTIONS} from './../index';
import {IBullet, ICollision, IBullets, ITanks} from '../interfaces';
import CONSTANTS from '../../../constants';

interface IBulletHitPoint {
    x: number
    y: number
}

interface IObjectToIntersect {
    id: string
    x: number
    y: number
}


class BulletsService {

    private bulletsToDelete: IBullet[] = []
    private oldCollisions: ICollision[] = []

    constructor() {
    }

    public getMovedBullets(bullets: IBullet[], newTanksBullets: ITanksBullets | null): IBullet[] {
        if (newTanksBullets) {
            const aNewTanksBullets = Object.values(newTanksBullets)
            const tanksBullets = [...bullets, ...aNewTanksBullets]
                .map((bullet) => {
                    return bullet.new
                        ? {...bullet, new: false}
                        : {...this.moveBullet(bullet)}
                    // return this.moveBullet(bullet)
                })
            return tanksBullets
        } else {
            const tanksBullets = bullets
                .map((bullet) => {
                    return bullet.new
                        ? {...bullet, new: false}
                        : {...this.moveBullet(bullet)}
                    // return this.moveBullet(bullet)
                })
            return tanksBullets
        }
    }

    public updateBulletStartPosition(tanksBullets: IBullets, tanks: ITanks): IBullets {
        const updatedTanksBullets: IBullets = {}
        Object.values(tanksBullets).map((bullet: IBullet) => {
            if (tanks[bullet.tankId]) {
                updatedTanksBullets[bullet.tankId] = {
                    ...bullet,
                    x: tanks[bullet.tankId].x,
                    y: tanks[bullet.tankId].y,
                    direction: tanks[bullet.tankId].direction
                }
            }
        })
        return updatedTanksBullets
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
        const collisions = bullets
            .filter((bullet: IBullet) => !bullet.exploided)
            .map((bullet: IBullet) => {
                return this.getBulletCollisions(bullet, objectsToIntersect)
            })
            .reduce((acc, val) => acc.concat(val), [])
            .filter((collision: ICollision) => {
                const bullet = bullets.filter(bullet => bullet.id === collision.bulletId)[0]
                return collision.objectId !== bullet.tankId
            })
        return collisions
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
                        active: bulletHitPoint.x === object.x && bulletHitPoint.y === object.y,
                        done: false
                    }
                }).filter((collision: ICollision) => collision.active)
        }).reduce((acc, val) => acc.concat(val), [])
    }

    private getBulletHitLine(bullet: IBullet): IBulletHitPoint[] {
        let bulletHitLine: IBulletHitPoint[] = []
        // for (let i = 0;i < 3;i++) {
        //     bulletHitLine.push(this.getBulletHitPoint(bullet, i))
        // }
        bulletHitLine.push(this.getBulletHitPoint(bullet, 0))
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

    public ridOfExploidedBullets(bullets: IBullet[], collisions: ICollision[]) {
        const existingBullets = bullets.filter((bullet: IBullet): boolean => {
            return this.bulletsToDelete
                .map((bulletToDelete: IBullet): boolean => {
                    return bulletToDelete.id !== bullet.id
                })
                .reduce((acc, val) => {return acc && val}, true)
        })

        this.bulletsToDelete = bullets.filter((bullet: IBullet): boolean => {
            return collisions
                .map((collision: ICollision): boolean => {
                    return collision.bulletId === bullet.id
                })
                .reduce((acc, val) => {return acc || val}, false)
        })

        return existingBullets.map(((bullet: IBullet) => {
            return {
                ...bullet,
                exploided: this.bulletsToDelete
                    .filter((bulletToDelete: IBullet) => bulletToDelete.id === bullet.id)
                    .length > 0
            }
        }))
    }

}

const bulletsService = new BulletsService()
export default bulletsService