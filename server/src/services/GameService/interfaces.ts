export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface ITank {
    id: string
    name: string
    hp: number
    x: number
    y: number
    direction: Direction
}

export interface ITanks {
    [index: string]: ITank
}

export type Directions =  {[k in Direction]: Direction}
