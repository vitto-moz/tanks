import {Tank} from './tank.model';
import randomId from '../../utils/randomId';
import {ITanks, Direction, Directions, ITank} from './interfaces';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

const UPDATING_INTERVAL = 1000

class GameService {
    public tanks: ITanks = {}
    public tanksMovements: {[index: string]: Direction} = {}

    public startUpdatingSycle(emitUpdate: (tanks: ITanks) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            // console.log('setInterval this.tanks ', this.tanks)
            this.moveTanks()
            emitUpdate(this.tanks)
        }, UPDATING_INTERVAL
        )
    }

    public addTank(name: string, id: string): string {
        // const id = randomId().toString()
        this.tanks[id] = new Tank(name, id)
        console.log('this.tanks ==> ', this.tanks)
        return id
    }

    public updateTank(tank: ITank) {
        this.tanks[tank.id] = tank
    }

    private moveTanks() {
        if (this.tanksMovements) {
            Object.keys(this.tanksMovements).map(id => {
                this.moveTank(id, this.tanksMovements[id])
            })
        }
        this.tanksMovements = {}
    }

    public registerMovement(id: string, direction: Direction) {
        this.tanksMovements[id] = direction
    }

    public moveTank(id: string, direction: Direction) {
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