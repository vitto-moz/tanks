import {ITank, Direction, IBullet, TeamId} from './interfaces';

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

    constructor(name: string, id: string, teamId: TeamId) {
        this.id = id
        this.name = name
        this.teamId = teamId
        this.hp = 100
        this.x = 0
        this.y = 0
        this.direction = 'UP'
        this.fire = false
        this.skinUrl = 'https://opengameart.org/sites/default/files/preview_344.png'
        this.bullets = []
    }
}