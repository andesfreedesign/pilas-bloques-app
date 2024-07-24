import { Button, IconButton, Stack } from "@mui/material"
import { scene } from "../scene"
import { interpreterFactory } from "./interpreter-factory"
import Interpreter from "js-interpreter"
import { useThemeContext } from "../../../theme/ThemeContext"
import styles from './sceneButtons.module.css'
import { Circle, PlayArrow } from "@mui/icons-material"

export const ExecuteButton = () => {

    const { isSmallScreen } = useThemeContext()

    const handleExcecute = async () => {
        await scene.restartScene('new EscenaLita(["[[A,-,-],[-,-,-],[-,-,-]]"])') //TODO context para el challenge? de donde lo saco? esta en muchos lugares como parametro???? vale la pena?
        const interpreter = interpreterFactory.createInterpreter()
        executeUntilEnd(interpreter)
    }

    const executeUntilEnd = (interpreter: Interpreter) => {
        return new Promise((success, reject) => {
            let moreToExecute: boolean

            const executeInterpreter = (interpreter: Interpreter) => {
                try {
                    moreToExecute = interpreter.run();
                } catch (e) {
                    console.log(e);
                    reject(e);
                }
                if (moreToExecute) {
                    setTimeout(executeInterpreter, 10, interpreter)
                } else {
                    success({ finished: true })
                }
            }

            executeInterpreter(interpreter)
        })
    }

    return <>
        {isSmallScreen ? <>
            <IconButton className={styles['icon-button']} onClick={handleExcecute}>
                <Stack>
                    <Circle color='success' className={styles['circle-icon']} />
                    <PlayArrow className={styles['icon']} />
                </Stack>
            </IconButton >
        </> :
            <Button variant="contained" color="success" onClick={handleExcecute}>{"Ejecutar"}</Button>
        }
    </>

}

/**
 * Context para challenge
 * Tipos
 * Bloques que no escupen codigo que deberian: con parametros, repeat (ver cambio al repeat de prod), procedimientos
 * Test 
 * Pantalla vertical -> ejecutar en un mismo componente
 */