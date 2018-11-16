export type direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface ITank {
    id: string
    name: string
    hp: number
    x: number
    y: number
    direction: direction
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

export type directions = {[k in direction]: direction};
