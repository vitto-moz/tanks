export type direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface ITank {
    id: string
    name: string
    hp: number
    x: number
    y: number
    direction: direction
}

export interface ITanks {
    [index: string]: ITank
}

export type directions =  {[k in direction]: direction}
