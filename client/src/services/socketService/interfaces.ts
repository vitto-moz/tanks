export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// export interface IBullet {
//     onFly: boolean;
//     direction: Direction;
// }

export type TeamId = 'YELLOW' | 'GREEN'

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
    teamId: TeamId
    score: number
}

export interface ITanks {
    [index: string]: ITank
};

export interface IBullet {
    id: string
    tankId: string
    x: number
    y: number
}

export interface IConfig {
    x: number
    y: number
}


export type EnvironmentElementsType = 'w' | 'e' | 'b'

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
}


export interface IGameState {
    tanks: ITanks
    environment: IEnvironment
    config: IConfig
    bullets: IBullet[]
    collisions: ICollision[]
}

export interface ICoordinate {
    id: string,
    x: number,
    y: number
}

export interface ICoordinates {
    [index: string]: ICoordinate
}

export type Directions = {[k in Direction]: Direction};
