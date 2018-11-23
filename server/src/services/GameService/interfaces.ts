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

export interface IWall {
    x: number
    y: number
    hp: number
}

export interface IWater {
    x: number
    y: number
    hp: number
}

export interface IBullet {
    tankId: string
    x: number
    y: number
}

export interface IEnvironment {
    walls: {[index: string]: IWall}
    water: {[index: string]: IWater}
}

export interface IGameState {
    tanks: ITanks
    environment: IEnvironment
    config: IConfig
    bullets: IBullet[]
}

export type Directions = {[k in Direction]: Direction}
