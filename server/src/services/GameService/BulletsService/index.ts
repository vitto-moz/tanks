import {ITanks, Directions, ITank, IBullet} from '../interfaces';
import CONSTANTS from '../../../constants';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}


class BulletsService {

    constructor() {
    }

    public getMovedBullets(bullets: IBullet[]): IBullet[] {

        const tanksBullets = bullets
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


}

const bulletsService = new BulletsService()
export default bulletsService