import {ITank, Direction, IBullet} from './interfaces';

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

    constructor(name: string, id: string) {
        this.id = id
        this.name = name
        this.hp = 100
        this.x = 0
        this.y = 0
        this.direction = 'UP'
        this.fire = false
        this.skinUrl = 'https://opengameart.org/sites/default/files/preview_344.png'
        this.bullets = []
    }
}