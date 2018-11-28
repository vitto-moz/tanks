import {ITanks, Directions, ITank, IBullet} from '../interfaces';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}


const BULLET_MOVE_QUANTUM = 3


class BulletsService {

    constructor() {
    }

    public getMovedBullets(bullets: IBullet[], tansk: ITanks): IBullet[] {
        const tanksBullets = bullets.map((bullet) => {
            return bullet.new ? {...bullet, new: false} : this.moveBullet(bullet, tansk[bullet.tankId])
        })
        return tanksBullets
    }


    private moveBullet(bullet: IBullet, tank: ITank): IBullet {
        const direction = tank.direction
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


}

const bulletsService = new BulletsService()
export default bulletsService