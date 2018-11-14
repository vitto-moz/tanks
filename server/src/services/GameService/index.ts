import {Tank} from './tank.model';
import randomId from '../../utils/randomId';
import {ITanks, direction, directions, ITank} from './interfaces';

export const DIRECTIONS: directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

const UPDATING_INTERVAL = 1000

class GameService {
    public tanks: ITanks = {}

    public startUpdatingSycle(emitUpdate: (tanks: ITanks) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            // console.log('setInterval this.tanks ', this.tanks)
            emitUpdate(this.tanks)
        }, UPDATING_INTERVAL
        )
    }

    public addTank(name: string): string {
        const id = randomId().toString()
        this.tanks[id] = new Tank(name, id)
        console.log('this.tanks ==> ', this.tanks)
        return id
    }

    public updateTank(tank: ITank) {
        this.tanks[tank.id] = tank
    }

    public moveTank(id: string, direction: direction) {
        if (this.tanks[id]) {
            this.tanks[id].direction = direction
            switch (direction) {
                case DIRECTIONS.UP:
                    this.tanks[id].y = this.tanks[id].y - 100
                    break
                case DIRECTIONS.DOWN:
                    this.tanks[id].y = this.tanks[id].y + 100
                    break
                case DIRECTIONS.LEFT:
                    this.tanks[id].x = this.tanks[id].x - 100
                    break
                case DIRECTIONS.RIGHT:
                    this.tanks[id].x = this.tanks[id].x + 100
                    break
            }
        }
    }

}

const gameService = new GameService()
export default gameService