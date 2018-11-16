import {Tank} from './tank.model';
import {ITanks, Direction, Directions, ITank, IGameState} from './interfaces';
import GAME_STATE from './config';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

const UPDATING_INTERVAL = 1000
const MOVE_QUANTUM = 1

class GameService {
    public tanks: ITanks = {}
    public gameState: IGameState = GAME_STATE
    public tanksMovements: {[index: string]: Direction} = {}

    public startUpdatingSycle(emitUpdate: (gameState: IGameState) => void) {
        // emitUpdate - is a socket io event to update polygon 
        setInterval(() => {
            // console.log('setInterval this.tanks ', this.tanks)
            this.moveTanks()
            emitUpdate(this.gameState)
        }, UPDATING_INTERVAL
        )
    }

    public addTank(name: string, id: string): string {
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
        this.gameState.tanks = this.tanks
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
                    this.tanks[id].y = this.tanks[id].y - MOVE_QUANTUM
                    break
                case DIRECTIONS.DOWN:
                    this.tanks[id].y = this.tanks[id].y + MOVE_QUANTUM
                    break
                case DIRECTIONS.LEFT:
                    this.tanks[id].x = this.tanks[id].x - MOVE_QUANTUM
                    break
                case DIRECTIONS.RIGHT:
                    this.tanks[id].x = this.tanks[id].x + MOVE_QUANTUM
                    break
            }
        }
    }

}

const gameService = new GameService()
export default gameService