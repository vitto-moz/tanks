import {ITank, Direction, IBullet, TeamId, IStartPoint, ITanks} from './interfaces';

const START_POINT_TYPES = {
    'GREEN': 'g',
    'YELLOW': 'y',
}

export class Tank implements ITank {
    public id: string
    public name: string
    public hp: number
    public x: number
    public y: number
    public direction: Direction
    public fire: boolean
    public bullets: IBullet[]
    public skinUrl: string
    public teamId: TeamId
    public dead: boolean = false

    constructor(
        name: string,
        id: string,
        teamId: TeamId,
        skinUrl: string,
        startPoints: IStartPoint[],
        tanks: ITanks
    ) {
        this.id = id
        this.name = name
        this.teamId = teamId
        this.hp = 100
        const {x, y} = this.pickStartPoint(startPoints, START_POINT_TYPES[teamId], tanks)
        this.x = x
        this.y = y
        this.direction = teamId === 'GREEN' ? 'DOWN' : 'UP'
        this.fire = false
        this.skinUrl = skinUrl ? skinUrl : 'https://opengameart.org/sites/default/files/preview_344.png'
        this.bullets = []
    }

    private pickStartPoint(
        startPoints: IStartPoint[],
        startPointType: string,
        tanks: ITanks
    ): IStartPoint {
        console.log('startPoints ', startPoints)
        const aTanks = Object.values(tanks)
        return startPoints.filter((startPoint: IStartPoint) => {
            return startPoint.type === startPointType && this.isStartPointFree(startPoint, aTanks)
        })[0] || {x: 1, y: 1}
    }

    private isStartPointFree(startPoint: IStartPoint, tanks: ITank[]): boolean {
        return tanks.filter((tank: ITank) => {
            return tank.x === startPoint.x && tank.y === startPoint.y
        }).length === 0
    }


}