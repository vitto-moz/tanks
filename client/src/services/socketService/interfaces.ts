export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface IBullet {
    onFly: boolean;
    direction: Direction;
}

export interface ITank {
    id: string
    name: string
    hp: number
    x: number
    y: number
    direction: Direction
    bullets: IBullet[]
    fire: boolean
};

export interface ITanks {
    [index: string]: ITank
};

export interface IConfig {
    x: number
    y: number
}

export interface IEnvironment {
    x: number
    y: number
}

export interface IGameState {
    tanks: ITanks
    environment: IEnvironment
    config: IConfig
}

export type Directions = {[k in Direction]: Direction};
