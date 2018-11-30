import {IObstacle} from './../interfaces';
import {ITanks, Directions, ITank, IBullet} from '../interfaces';

export const DIRECTIONS: Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}


class ObstacleService {

    constructor() {
    }

    public getCheckedTanksToEachOther(possibleTanks: ITanks, tanks: ITanks): ITanks {
        Object.keys(possibleTanks)
            .map(currentTankId => {
                return {
                    id: currentTankId,
                    obstacles: Object.keys(possibleTanks).map((tankToCheckId) => {
                        if (tankToCheckId !== currentTankId) {
                            return possibleTanks[tankToCheckId].x === possibleTanks[currentTankId].x
                                && possibleTanks[tankToCheckId].y === possibleTanks[currentTankId].y
                        } else {
                            return null
                        }
                    }).filter(tankObstacle => tankObstacle !== null)
                }
            })
            .map((tankObstacle) => {
                // if no obstacles we set false
                return {
                    id: tankObstacle.id,
                    obstacle: tankObstacle.obstacles.length !== 0
                        ? tankObstacle.obstacles.reduce((aggregatedObstacle, obstacle) => aggregatedObstacle || obstacle)
                        : false
                }
            })
            .map(tankObstacle => {
                if (tankObstacle.obstacle) {
                    possibleTanks[tankObstacle.id] = {
                        ...tanks[tankObstacle.id],
                        direction: possibleTanks[tankObstacle.id].direction
                    }
                }
            })

        return possibleTanks
    }

    public checkTanksToEnvironment(
        possibleTanks: ITanks,
        obstacles: IObstacle[],
        tanks: ITanks
    ): ITanks {

        const tanksOnObstacle = Object.values(possibleTanks)
            .filter((possibleTank: ITank) => {
                return obstacles.map((obstacle: IObstacle): boolean => {
                    return possibleTank.x === obstacle.x && possibleTank.y === obstacle.y
                }).reduce((acc, val) => {return acc || val}, false)
            })

        tanksOnObstacle.map((tank: ITank) => {
            possibleTanks[tank.id] = tanks[tank.id]
        })

        return possibleTanks
    }

}

const obstacleService = new ObstacleService()
export default obstacleService