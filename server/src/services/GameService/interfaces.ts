export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

// export interface IBullet {
//     onFly: boolean;
//     direction: Direction;
// }

export interface ITank {
    id: string
    name: string
    hp: number
    x: number
    y: number
    direction: Direction
    bullets: IBullet[]
    fire: boolean
    skinUrl: string
}

export interface ITanks {
    [index: string]: ITank
}

export interface IConfig {
    x: number
    y: number
}

export type EnvironmentElementsType = 'w' | 'e' | 'b'
export type EnvironmentElement = IBrick | IWater

export interface IBrick {
    id: string
    type: EnvironmentElementsType
    x: number
    y: number
    hp: number
}

export interface IWater {
    id: string
    type: EnvironmentElementsType
    x: number
    y: number
    hp: number
}

export interface IBullet {
    id: string
    tankId: string
    x: number
    y: number
    new: boolean
    direction: Direction
}

export interface IBullets {
    [index: string]: IBullet
}

export interface IEnvironment {
    bricks: {[index: string]: IBrick}
    water: {[index: string]: IWater}
}

export interface ICollision {
    bulletId: string
    objectId: string
    x: number
    y: number
    active: boolean
    done: boolean
}

export interface IGameState {
    tanks: ITanks
    environment: IEnvironment
    config: IConfig
    collisions: ICollision[]
    bullets: IBullet[]
}

export type IObstacle = IWater | IBrick

export type Directions = {[k in Direction]: Direction}
