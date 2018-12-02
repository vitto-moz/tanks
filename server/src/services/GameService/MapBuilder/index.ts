import map, {Map} from './../Map/index';
import {IEnvironment, EnvironmentElement, EnvironmentElementsType, IWater, IBrick, IStartPoint} from '../interfaces';
import randomId from '../../../utils/randomId';

class MapBuilder {

    private environmentElements: EnvironmentElement[] = []

    constructor(mapConfig: Map) {
        this.environmentElements = mapConfig.map((
            row: EnvironmentElementsType[],
            rowIndex: number
        ): EnvironmentElement[] => {
            const rowElements: EnvironmentElement[] =
                row.map((type: EnvironmentElementsType, columneIndex: number) => {
                    return {
                        id: randomId(),
                        type,
                        x: columneIndex,
                        y: rowIndex,
                        hp: 100
                    }
                })
            return rowElements
        }).reduce((acc, val) => acc.concat(val), [])
    }

    public getMapEnvironment(): IEnvironment {
        return this.getEnvironmentFromElements(this.environmentElements)
    }

    public getStartPoints(): IStartPoint[] {
        return this.environmentElements.filter((element: EnvironmentElement) => {
            return element.type === 'y' || element.type === 'g'
        }).map((startPoint: EnvironmentElement): IStartPoint => {
            return {
                ...startPoint,
                free: true
            }
        })
    }

    private getEnvironmentFromElements(elements: EnvironmentElement[]): IEnvironment {
        const water: {[index: string]: IWater} = {}
        elements.filter((element: EnvironmentElement) => {
            return element.type === 'w'
        }).map((waterElement: IWater) => {
            water[waterElement.id] = waterElement
        })

        const bricks: {[index: string]: IBrick} = {}
        elements.filter((element: EnvironmentElement) => {
            return element.type === 'b'
        }).map((brickElement: IBrick) => {
            bricks[brickElement.id] = brickElement
        })

        return {
            bricks,
            water
        }

    }
}

const mapBuilder = new MapBuilder(map)
export default mapBuilder