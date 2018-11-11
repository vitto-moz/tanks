import {Tank} from './tank.model';
import randomId from '../../utils/randomId';
import {ITanks} from './interfaces';

class GameService {
    public tanks: ITanks = {}

    public addTank(name: string) {
        const id = randomId().toString()
        this.tanks[id] = new Tank(name, id)
    }

}

const gameService = new GameService()
export default gameService