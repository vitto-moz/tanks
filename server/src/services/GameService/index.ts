import {Tank} from './tank.model';
import randomId from '../../utils/randomId';
import {ITanks, direction, directions} from './interfaces';

const DIRECTIONS: directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

class GameService {
    public tanks: ITanks = {}

    public addTank(name: string) {
        const id = randomId().toString()
        this.tanks[id] = new Tank(name, id)
    }

    public moveTank(id: string, direction: direction) {
        switch (direction) {
            case DIRECTIONS.UP:
                this.tanks[id].y + 1
            case DIRECTIONS.DOWN:
                this.tanks[id].y - 1
            case DIRECTIONS.LEFT:
                this.tanks[id].x - 1
            case DIRECTIONS.RIGHT:
                this.tanks[id].x + 1
        }
    }

}

const gameService = new GameService()
export default gameService