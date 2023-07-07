import { Stack } from "@mui/material"
import { SceneMap, SceneType, SerializedChallenge, defaultChallenge } from "../serializedChallenge"
import { LocalStorage } from "../../localStorage"
import styles from "./grid.module.css"
import { useContext } from "react"
import { CreatorContext } from "./CreatorContext"

type SceneGridProps = {
    mapIndex: number
}

export const SceneGrid = (props: SceneGridProps) => {
    const storageChallenge = LocalStorage.getCreatorChallenge()
    const challenge: SerializedChallenge = storageChallenge ? storageChallenge : defaultChallenge('Duba')

    const maps: SceneMap[] = challenge.scene.maps
    const sceneType: SceneType = challenge.scene.type

    return <Stack className={styles.grid + ' ' + styles.border}>
        {maps[props.mapIndex].map((row, i) =>
            <Stack key={i + row.join(',')} direction="row" data-testid="challenge-row">
                {row.map((cellContent, j) =>
                    <SceneCell
                        position = {{row: i, column: j}}
                        key={i * 100 + j + cellContent}
                        content={cellContent}
                        sceneType={sceneType} />)}
            </Stack>)}
    </Stack>
}

type CellProps = {
    position: Position
    content: string,
    sceneType: SceneType
}

type Position = {
    row: number,
    column: number
}

export const SceneCell: React.FC<CellProps> = (props) => {

    const { selectedTool } = useContext(CreatorContext)

    const imagePath = `imagenes/sceneImages/${props.sceneType}`
    const backgroundCellImage = `${imagePath}/casilla.png`

    const objectsInCell = props.content.split('&').filter(o => o !== '-')
    const objectStyle = (object: string) => styles[`img-${object}`] || styles['img-default']

    const hasMultipleObjects = objectsInCell.length > 1

    const handleClick = () => {
        const challenge = LocalStorage.getCreatorChallenge()
        challenge!.scene.maps[0][props.position.row][props.position.column] = selectedTool

        LocalStorage.saveCreatorChallenge(challenge)
    }


    return <div
        data-testid="challenge-cell"
        className={styles.cell}
        style={{ backgroundImage: `url(${backgroundCellImage})`, justifyContent: !hasMultipleObjects ? 'center' : '' }}
        onClick={handleClick}>
        {objectsInCell.map(obj =>
            <img
                data-testid="challenge-cell-image"
                key={'&' + obj}
                src={`${imagePath}/${obj}.png`}
                alt={obj}
                className={objectStyle(obj)} />
        )}
    </div>
}
