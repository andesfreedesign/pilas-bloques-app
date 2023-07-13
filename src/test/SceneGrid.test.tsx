import { render, screen } from '@testing-library/react'
import { defaultChallenge } from '../components/serializedChallenge';
import { LocalStorage } from '../localStorage';
import { SceneGrid } from '../components/creator/Editor/SceneEdition/Grid/SceneGrid';
import { SerializedChallenge } from '../components/serializedChallenge';

describe('Scene grid', () => {

    const getAmountFromChallenge = async (id: string) => await screen.getAllByTestId(`challenge-${id}`).length

    const getGridSize = async () => {

        const rows = await getAmountFromChallenge('row')
        const columns = await getAmountFromChallenge('cell') / rows

        return {rows, columns}
    }

    afterEach(() => {
        localStorage.clear()
    })

    test('Should set grid size according to local storage', async () => {

        const challenge: SerializedChallenge = {
            ...defaultChallenge("Duba"),
            scene: {
                type: "Duba",
                maps: [[["A","-","-","-","-"],["-","-","-","-","-"],["-","-","-","-","-"]]]
            }
        }

        LocalStorage.saveCreatorChallenge(challenge)
        render(<SceneGrid mapIndex={0}/>)

        expect((await getGridSize()).rows).toBe(3)
        expect((await getGridSize()).columns).toBe(5)

    })

    //Will change with refactor
/*     test('Should set grid size to default when there is no challenge saved', async () => {
        localStorage.clear()
        render(<SceneGrid mapIndex={0}/>)

        expect((await getGridSize()).rows).toBe(3)
        expect((await getGridSize()).columns).toBe(3)

    }) */

    test('Should have both object images in a cell when there is a & operator', async () =>{
        const challenge: SerializedChallenge = {
            ...defaultChallenge("Duba"),
            scene: {
                type: "Duba",
                maps: [[["A&P"]]]
            }
        }
        
        LocalStorage.saveCreatorChallenge(challenge)
        render(<SceneGrid mapIndex={0}/>)
        expect(await getAmountFromChallenge('cell-image')).toBe(2)
    })

})