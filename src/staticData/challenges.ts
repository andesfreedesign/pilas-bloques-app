import { ExcludeMethods } from "../typeHelpers"
import { Book, bookIncludesChallenge, getAllBooks } from "./books"
import { Chapter, chapterIncludesChallenge } from "./chapters"
import { Group } from "./groups"

export class Challenge {
  /**
   * Unique numerical identifier.
   * Used to access the challenge by URL.
   */
  id!: number
  /**
   * The pilasweb framework's scene for the challenge.
   * Scene class name or scene string initializer e.g. "new Scene..."
   * Parsed as js, defined in pilas-bloques-exercises.
   */
  sceneDescriptor!: string
  /**
   * Blockly toolbox block ids available in this challenge.
   */
  toolboxBlockIds!: string[]
  /**
   * When true, challenge has "step" button.
   */
  debugging?: boolean
  /**
   * Json object with expectation configuration for this challenge.
   * See https://github.com/Program-AR/pilas-bloques/blob/develop/app/services/challenge-expectations.js
   */
  expectations?: ExpectationConfig
  /**
   * When true, shows yelow arrow that remembers the user there are multiple scenarios.
   */
  shouldShowMultipleScenarioHelp?: boolean
  /**
   * 'categorized' shows the toolbox with titles and flyout menu. (e.g for "Intermediate" challenges)
   * 'noCategories' just shows the toolbox blocks with no titles and no flyout menu. (e.g. "Initial" challenges)
   */
  toolboxStyle?: 'categorized' | 'noCategories'
  /**
   * Default to true. When false, we don't check if the solution solves the challenge i.e. no congratulations modal.
   * E.g. The "free draw" challenges will be false.
   **/
  hasAutomaticGrading?: boolean
  /**
   * Predefined solution (in XML format) to appear in challenge.
   * Usually used together with debugging in true 
   * (i.e. when you want the student to fix a bug in the provided solution).
  */
  predefinedSolution?: string

  constructor(b: BasicChallenge){
    Object.assign(this, b)
  }

  imageURL(): string {
    return `imagenes/challengeCovers/${this.id}.png`
  }
}

export type ExpectationConfig = {
  decomposition?: boolean,
  decomposition9?: boolean,
  conditionalAlternative?: boolean,
  simpleRepetition?: boolean,
  conditionalRepetition?: boolean
}

/**
  @throws Error
 **/
export const getChallengeWithId = (id: number): Challenge => {
  const challenge: BasicChallenge[] = challenges.filter(challenge => challenge.id === id)
  if (challenge.length > 1) throw new Error(`There are multiple challenges with id "${id}"`)
  if (challenge.length === 0) throw new Error(`Challenge with id "${id}" does not exist`)

  return new Challenge(challenge[0])
}
  
const legacyChallenges = [{id:1, name:"AlienTocaBoton"}, {id:46, name:"NuevosComandos"}, {id:2, name:"ElGatoEnLaCalle"}, {id:3, name:"NoMeCansoDeSaltar"}, {id:4, name:"ElMarcianoEnElDesierto"}, {id:5, name:"TitoEnciendeLuces"}, {id:6, name:"ElAlienYLasTuercas"}, {id:7, name:"ElRecolectorDeEstrellas"}, {id:8, name:"MariaLaComeSandias"}, {id:9, name:"AlimentandoALosPeces"}, {id:10, name:"InstalandoJuegos"}, {id:11, name:"LaGranAventuraDelMarEncantado"}, {id:12, name:"ReparandoLaNave"}, {id:13, name:"ElMonoYLasBananas"}, {id:14, name:"LaEleccionDelMono"}, {id:15, name:"LaberintoCorto"}, {id:16, name:"TresNaranjas"}, {id:17, name:"TitoRecargado"}, {id:18, name:"LaberintoLargo"}, {id:19, name:"SuperTito1"}, {id:20, name:"SuperTito2"}, {id:21, name:"LaberintoConQueso"}, {id:22, name:"ElDetectiveChaparro"}, {id:23, name:"FutbolRobots"}, {id:24, name:"PrendiendoLasCompus"}, {id:25, name:"ElMonoQueSabeContar"}, {id:26, name:"ElSuperviaje"}, {id:27, name:"ElMonoCuentaDeNuevo"}, {id:28, name:"ElPlanetaDeNano"}, {id:29, name:"DibujandoAlCuadrado"}, {id:30, name:"DibujandoRayuelaRobotica"}, {id:31, name:"DibujandoCortoPorLaDiagonal"}, {id:32, name:"DibujandoMamushkaCuadrada"}, {id:33, name:"DibujandoEscaleraCuadrada"}, {id:34, name:"DibujandoHexagono"}, {id:35, name:"DibujandoPiramideInvertida"}, {id:36, name:"DibujandoFigurasDentroDeFiguras"}, {id:37, name:"DibujandoLaCuevaDeEstalagtitas"}, {id:38, name:"LasRocasDeNano"}, {id:39, name:"LosCaminosDeNano"}, {id:40, name:"UnaFiestaArruinada"}, {id:41, name:"RedecorandoFiestas"}, {id:42, name:"ElDesiertoMultiFrutal"}, {id:43, name:"ElPasilloCurvoDeSandias"}, {id:44, name:"ElFestinFrutal"}, {id:45, name:"RecolectorDeGalaxias"}, {id:130, name:"LaFiestaDeDracula"}, {id:131, name:"SalvandoLaNavidad"}, {id:132, name:"PrendiendoLasCompusParametrizado"}, {id:133, name:"TitoCuadrado"}, {id:134, name:"ElCangrejoAguafiestas"}, {id:135, name:"PrendiendoLasFogatas"}, {id:136, name:"DibujoLibre"}]

// Legacy challenge ids URLs should be redirected.
const isLegacy = (challengeId: number) => legacyChallenges.find( ({id}) => id === challengeId)
export const currentIdFor = (challengeId: number) => isLegacy(challengeId) ? challengeId + 1000 : challengeId

/**
  @throws Error
 **/
  export const getChallengeWithName = (challengeName: string): Challenge => {
    const challenge = legacyChallenges.find(({name}) => name === challengeName)
    if (!challenge) throw new Error(`Challenge with name "${challengeName}" does not exist`)
    return getChallengeWithId(currentIdFor(challenge.id))
  }

export type PathToChallenge = {
  book: Book,
  chapter: Chapter,
  group: Group,
  challenge: Challenge
}

export const getPathToChallenge = (challengeId: number): PathToChallenge => {
  const challenge: Challenge = getChallengeWithId(challengeId)
  const book: Book = getAllBooks().find(book => bookIncludesChallenge(book, challenge))!
  const chapter: Chapter = book.chapters.find(chapter => chapterIncludesChallenge(chapter, challenge))!
  const group: Group = chapter.groups.find(group => group.includes(challenge))!

  return {book, chapter, group, challenge}
}

/**
 * For testing purposes.
 * @returns all sceneDescriptors from existing challenges.
 */
export const allDescriptors = (): Challenge["sceneDescriptor"][] =>
  challenges.map( c => c.sceneDescriptor )

// This type allows to define a challenge in JSON
// Shouldn't be used outside this file, instead call getChallengeById to get a complete Challenge
// Not to be confused with SerializedChallenge, that is a CreatorChallenge.
type BasicChallenge = ExcludeMethods<Challenge>
const challenges: BasicChallenge[] = [
  {
    id: 201,
    sceneDescriptor: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,-,-,O,-],\
      [-,A,-,-,P,-],\
      [-,-,-,O,-,-],\
      [O,O,O,O,-,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
    id: 202,
    sceneDescriptor: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,O,O,O,O,O],\
        [O,-,O,-,P,O],\
        [O,-,A,-,O,O],\
        [O,O,-,O,O,O],\
        [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
    id: 203,
    sceneDescriptor: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
      [O,A,O,-,-,O],\
      [O,-,-,-,P,O],\
      [O,-,O,-,-,O],\
      [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
    id: 204,
    sceneDescriptor: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,A,O,O,O],\
      [O,O,-,O,O,O],\
      [O,O,-,-,-,O],\
      [O,O,O,P,-,O],\
      [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
    id: 205,
    sceneDescriptor: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,O,-,O,-,O],\
      [O,-,A,-,-,O],\
      [O,-,-,O,-,O],\
      [O,O,-,-,P,O],\
      [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
    id: 206,
    sceneDescriptor: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,-,-,-,-,O],\
      [O,-,O,P,-,O],\
      [O,A,O,-,O,O],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ]
  },
  {
    id: 207,
    sceneDescriptor: `new EscenaCoty(
      [{x:125,y:75},{x:125,y:-175},{x:-25,y:-175},{x:-25,y:-75},{x:25,y:-75},{x:25,y:-175},{x:-125,y:-175},{x:-125,y:125},{x:-75,y:125},{x:-75,y:75},{x:-25,y:75},{x:-25,y:125},{x:25,y:125},{x:25,y:75}],
      [{x:25,y:75},{x:75,y:75},{x:75,y:125},{x:125,y:125},{x:125,y:75}],
      {xCoty: 25, yCoty: 75}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 208,
    sceneDescriptor: `new EscenaCoty(
      [{x:-50,y:25},{x:0,y:100},{x:50,y:25}],
      [{x:-50,y:25},{x:0,y:25},{x:50,y:25},{x:50,y:-25},{x:50,y:-75},{x:0,y:-75},{x:-50,y:-75},{x:-50,y:-25},{x:-50,y:25}],
      {xCoty: -50, yCoty: 25}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 209,
    sceneDescriptor: `new EscenaCoty(
      [],
      [[ {x:-125,y:0}, {x:-75,y:0}],[ {x:-25,y:0}, {x:25,y:0}],[ {x:75,y:0}, {x:125,y:0}]],
      {xCoty: 125, yCoty: 0}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 210,
    sceneDescriptor: `new EscenaCotySonrisa()`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda'
    ]
  },
  {
    id: 211,
    sceneDescriptor: `new EscenaCoty(
      [[{x:-55,y:50},{x:-150,y:50},{x:-150,y:0},{x:-50,y:0}],[{x:-75,y:0},{x:-75,y:-100},{x:-125,y:-100},{x:-125,y:0}],[{x:-25,y:0},{x:25,y:0},{x:25,y:-100},{x:-25,y:-100},{x:-25,y:0}],[{x:125,y:0},{x:125,y:-100},{x:75,y:-100},{x:75,y:0}],[{x:50,y:0},{x:150,y:0},{x:150,y:50},{x:50,y:50}]],
      [{x:-50,y:0},{x:0,y:0},{x:50,y:0},{x:50,y:50},{x:0,y:50},{x:-50,y:50},{x:-50,y:0}],
      {xCoty: -50, yCoty: 100}      
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda'
    ]
  },
  {
    id: 212,
    sceneDescriptor: `new EscenaCotyCactus()`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 213,
    sceneDescriptor: `new EscenaCotyMate()`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 214,
    sceneDescriptor: `new EscenaLita("\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
      [O,A,-,T,L,-],\
      [O,O,O,O,O,E],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O]\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 215,
    sceneDescriptor: `new EscenaLita("\
      [O,O,O,O,O],\
      [O,O,O,O,O],\
      [-,-,T,-,-],\
      [-,-,L,-,-],\
      [A,O,O,O,E],\
      [O,O,O,O,O]\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 216,
    sceneDescriptor: `new EscenaLita("\
      [-,-,-],\
      [-,L,-],\
      [A,-,E],\
      [-,T,-]\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 217,
    sceneDescriptor: `new EscenaLita("\
      [-,-,-,-],\
      [-,L,T,-],\
      [A,-,-,E],\
      [-,-,-,-]\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 218,
    sceneDescriptor: `new EscenaLita("\
      [-,A,-],\
      [L,E,T],\
      [-,-,-],\
      [-,-,-]\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 219,
    sceneDescriptor: `new EscenaLita("\
      [-,-,A],\
      [-,L,T],\
      [-,-,E]\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 220,
    sceneDescriptor: `new EscenaDuba("\
      [O,O,O,O,O,O],\
      [O,P,O,-,-,O],\
      [O,-,O,-,-,-],\
      [O,-,-,-,O,A],\
      [O,O,O,O,O,O],\
      [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 221,
    sceneDescriptor: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,-,-,O,O,O],\
        [O,-,P,O,O,O],\
        [O,-,-,O,O,O],\
        [O,-,-,-,A,O],\
        [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 222,
    sceneDescriptor: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,P,O,A,O,O],\
        [O,-,O,-,O,O],\
        [O,-,-,-,O,O],\
        [O,-,-,O,O,O],\
        [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaAbajo">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 223,
    sceneDescriptor: `new EscenaDuba("\
        [O,O,O,O,O,O],\
        [O,O,-,-,-,O],\
        [O,-,P,-,-,O],\
        [O,-,O,O,O,O],\
        [O,-,-,A,-,O],\
        [O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaIzquierda">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaArriba">
      <next>
      <block type="MoverACasillaDerecha">
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 224,
    sceneDescriptor: `new EscenaLita("\
      [O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O],\
      [O,O,O,O,-,T,O],\
      [O,A,-,-,L,E,O],\
      [O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O]\
    ")`,
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="AgarrarLechuga">
        <next>
        <block type="MoverACasillaArriba">
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="MoverACasillaAbajo">
        <next>
        <block type="PrepararEnsalada">
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
      </statement>
      </block>
    </xml>`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
    ],
  },
  {
    id: 225,
    sceneDescriptor: `new EscenaTotoLector([
        ['A', 'r', 'e'],
        ['t', 'o', 'j'],
        ['i', 't', 'o'],
    ], "toto")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 226,
    sceneDescriptor: `new EscenaTotoLector([
        ['r', 'h', 'j', 'a'],
        ['z', 'A', 'a', 'm'],
        ['y', 'l', 'l', 'q']
    ], "llama")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 227,
    sceneDescriptor: `new EscenaTotoLector([
        ['a', 'm', 'A'],
        ['f', 'u', 'p'],
        ['r', 'y', 'a'],
    ], "puma")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 228,
    sceneDescriptor: `new EscenaTotoLector([
        ['A', 'c', 'a', 'b'],
        ['o', 'l', 'l', 'e'],
    ], "caballo")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoAbajo">
        <next>
        <block type="MoverLeyendoIzquierda">
        <next>
        <block type="MoverLeyendoIzquierda">
        <next>
        <block type="MoverLeyendoIzquierda">
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
      </statement>
      </block>
    </xml>`,
  },
  {
    id: 229,
    sceneDescriptor: `new EscenaTotoLector([
        ['w', 'a', 'r'],
        ['u', 'n', 'e'],
        ['l', 'A', 's'],
    ], "lunes", 7)`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverLeyendoIzquierda">
        <next>
        <block type="MoverLeyendoArriba">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoArriba">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoAbajo">
        <next>
        <block type="MoverLeyendoAbajo">
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
      </statement>
      </block>
    </xml>`,
  },
  {
    id: 230,
    sceneDescriptor: `new EscenaDuba("\
        [-,O,O,O,-,-,-,-],\
        [-,O,O,O,O,-,-,-],\
        [O,O,-,O,O,-,-,-],\
        [O,O,-,-,-,-,-,-],\
        [A,-,-,-,-,-,-,P],\
        [-,-,O,-,O,-,-,-],\
        [-,-,O,O,O,O,O,O],\
        [-,-,-,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ]
  },
  {
    id: 231,
    sceneDescriptor: `new EscenaDuba("\
        [O,O,-,O,O,-,-,-],\
        [O,P,-,O,O,-,-,-],\
        [O,-,-,O,-,-,-,-],\
        [O,-,O,O,-,-,-,-],\
        [O,-,O,O,O,-,-,-],\
        [-,-,O,O,O,O,-,-],\
        [-,-,O,O,O,O,O,O],\
        [-,-,A,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ]
  },
  {
    id: 232,
    sceneDescriptor: `new EscenaDuba("\
      [-,-,-,O,O,-,-,O],\
      [O,O,-,O,-,-,-,O],\
      [A,O,O,O,-,-,O,O],\
      [-,O,O,O,O,O,O,O],\
      [-,O,O,O,-,O,O,O],\
      [-,-,-,-,-,-,P,O],\
      [O,O,-,O,O,O,O,O],\
      [O,O,-,-,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ]
  },
  {
    id: 233,
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}     
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 234,
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20},{x:150,y:-20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}      
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 235,
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-40,y:-20},{x:-40,y:20},{x:0,y:20},{x:40,y:20},{x:40,y:60},{x:80,y:60},{x:120,y:60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 236,
    sceneDescriptor: `new EscenaDuba("\
      [-,-,-,-,O,O,O,O],\
      [-,-,-,-,-,-,-,O],\
      [-,-,-,-,-,-,-,-],\
      [-,P,-,-,-,-,-,-],\
      [-,-,-,-,-,O,A,-],\
      [-,-,-,-,O,O,O,O],\
      [O,O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="MoverACasillaArriba">
      <next>
      <block type="Repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">4</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaIzquierda">
          </block>
        </statement>
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 237,
    sceneDescriptor: `new EscenaDuba("\
      [O,-,-,-,O,O,O,O],\
      [-,A,-,-,-,-,O,-],\
      [O,O,-,-,-,-,-,-],\
      [O,O,O,-,-,-,-,-],\
      [O,O,O,-,-,-,-,-],\
      [O,O,O,O,O,-,P,-],\
      [O,O,O,O,O,O,O,O],\
      [O,O,O,O,O,O,O,O],\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="Repetir">
        <value name="count">
          <block type="math_number">
            <field name="NUM">5</field>
          </block>
        </value>
        <statement name="block">
          <block type="MoverACasillaDerecha">
          <next>
          <block type="MoverACasillaAbajo">
          </block>
          </next>
          </block>
        </statement>
      <next>
      <block type="ComerChurrasco">
      </block>
      </next>
      </block>
    </statement>
    </block>
  </xml>`,
  },
  {
    id: 238,
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-100,y:-100},{x:-100,y:-50},{x:-50,y:-50},{x:-50,y:0},{x:0,y:0},{x:0,y:50},{x:50,y:50},{x:50,y:100},{x:100,y:100}]],
      {xCoty: -100, yCoty: -100}      
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
        <statement name="program">
          <block type="Repetir">
            <value name="count">
              <block type="math_number">
                <field name="NUM">4</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverArribaDibujando"></block>
            </statement>
            <next>
              <block type="Repetir">
                <value name="count">
                  <block type="math_number">
                    <field name="NUM">4</field>
                  </block>
                </value>
                <statement name="block">
                  <block type="MoverDerechaDibujando"></block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`
  },
  {
    id: 239,
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-80,y:20},{x:-40,y:20},{x:-40,y:60},{x:0,y:60},{x:40,y:60},{x:40,y:20},{x:80,y:20},{x:80,y:-20},{x:120,y:-20},{x:120,y:-60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}      
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
        <statement name="program">
          <block type="Repetir">
            <value name="count">
              <block type="math_number">
                <field name="NUM">2</field>
              </block>
            </value>
            <statement name="block">
              <block type="MoverArribaDibujando">
                <next>
                  <block type="MoverDerechaDibujando"></block>
                </next>
              </block>
            </statement>
            <next>
              <block type="Repetir">
                <value name="count">
                  <block type="math_number">
                    <field name="NUM">3</field>
                  </block>
                </value>
                <statement name="block">
                  <block type="MoverDerechaDibujando"></block>
                </statement>
                <next>
                  <block type="Repetir">
                    <value name="count">
                      <block type="math_number">
                        <field name="NUM">3</field>
                      </block>
                    </value>
                    <statement name="block">
                      <block type="MoverAbajoDibujando"></block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`
  },
  {
    id: 240,
    sceneDescriptor: `new EscenaLita("\
      [O,-,-,-,O,-,A],\
      [-,-,-,O,O,-,O],\
      [O,O,O,O,-,-,O],\
      [O,O,O,O,-,O,O],\
      [O,-,O,-,-,O,O],\
      [-,-,O,-,O,O,O],\
      [E,L,T,-,O,O,O]\
    ")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir',
    ],
  },
  {
    id: 241,
    sceneDescriptor: `new EscenaLita("\
      [L,-,-,-,-,T,E],\
      [-,O,-,-,O,-,O],\
      [-,O,O,O,O,-,O],\
      [-,O,O,O,-,-,O],\
      [-,-,-,O,-,-,-],\
      [A,-,-,-,-,-,-],\
      [-,O,O,-,-,O,O]\
    ")`,
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">4</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaArriba">
            </block>
          </statement>
        <next>
        <block type="AgarrarLechuga">
        <next>
        <block type="Repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">5</field>
            </block>
          </value>
          <statement name="block">
            <block type="MoverACasillaDerecha">
            <next>
            <block type="AgarrarTomate">
            </block>
            </next>
            </block>
          </statement>
        <next>
        <block type="MoverACasillaDerecha">
        <next>
        <block type="PrepararEnsalada">
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
      </statement>
      </block>
    </xml>`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir',
    ],
  },
  {
    id: 242,
    sceneDescriptor: `new EscenaDuba("[A,P?(0.6)]", {}, [1,0])`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'HayChurrasco'
    ],
    expectations: {
      conditionalAlternative: true,
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 243,
    sceneDescriptor: `new EscenaDuba(["[A,-,-]","[A,P,-]","[A,-,P]","[A,P,P]"], {}, [2,0])`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'HayChurrasco'
    ],
    expectations: {
      conditionalAlternative: true,
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 244,
    sceneDescriptor: `new EscenaCoty(
      [],
      [{x:-120,y:50},{x:20,y:50},{x:20,y:-90},{x:-120,y:-90},{x:-120,y:50}],
      {xCoty: -120, yCoty: 50, puedeHaberCharco: true, longitudSegmento: 140}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Si',
      'HayCharco'
    ],
    expectations: {
      conditionalAlternative: true,
    }
  },
  {
    id: 245,
    sceneDescriptor: `new EscenaLita("[A,-,L|T]")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Si',
      'SiNo',
      'HayTomate',
      'HayLechuga',
    ],
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 246,
    sceneDescriptor: `new EscenaDuba(["\
      [O,O,O,O,O],\
      [O,A,-,P,O],\
      [O,O,O,O,O],\
      [O,O,O,O,O],\
      [O,O,O,O,O],\
    ","\
      [O,O,O,O,O],\
      [O,A,O,O,O],\
      [O,-,O,O,O],\
      [O,P,O,O,O],\
      [O,O,O,O,O],\
    "])`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'SiNo',
      'HayObstaculoArriba',
      'HayObstaculoAbajo',
      'HayObstaculoIzquierda',
      'HayObstaculoDerecha'
    ],
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 247,
    sceneDescriptor: `new EscenaDuba("\
      [O,O,O,O,O],\
      [-,-,*,-,-],\
      [A,-,*,-,P],\
      [O,O,O,O,O],\
    ", { coleccion: ["O"] })`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Si',
      'SiNo',
      'HayObstaculoArriba',
      'HayObstaculoAbajo',
      'HayObstaculoIzquierda',
      'HayObstaculoDerecha'
    ],
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 248,
    sceneDescriptor: `new EscenaDuba("[A,-,-,-,-,-,-,P?]", {}, [7,0])`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir',
      'Si',
      'SiNo',
      'HayChurrasco'
    ],
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 249,
    sceneDescriptor: `new EscenaDuba("[A,#P,#P,#P,#P,#P,#P,#P]", { macros: { "P": "*>P?" }, coleccion: ["P"] }, [7,0])`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir',
      'Si',
      'SiNo',
      'HayChurrasco'
    ],
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 250,
    sceneDescriptor: `new EscenaLita("[A],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[*>L|T],[E]", { coleccion: ["T", "L"] })`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir',
      'Si',
      'SiNo',
      'HayTomate',
      'HayLechuga',
    ],
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 251,
    sceneDescriptor: `new EscenaTotoEscritor(new ObjetivoCopiar())`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo'
    ],
  },

  {
    id: 252,
    sceneDescriptor: `new EscenaTotoEscritor(new ObjetivoX())`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'EscribirTextoDadoEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo'
    ],
  },

  {
    id: 253,
    sceneDescriptor: `new EscenaTotoEscritor(new ObjetivoMicha())`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'EscribirTextoDadoEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo',
      'hayVocalRMT'
    ],
  },

  {
    id: 254,
    sceneDescriptor: `new EscenaTotoEscritor(new ObjetivoJeringozo())`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'EscribirLetraActualEnOtraCuadricula',
      'EscribirTextoDadoEnOtraCuadricula',
      'Repetir',
      'Si',
      'SiNo',
      'hayVocalRMT'
    ],
  },

  {
    id: 255,
    sceneDescriptor: `new EscenaCoty([],[],{xCoty: -50, yCoty: 50})`,
    hasAutomaticGrading: false,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda', 'Repetir', 'DibujarLado', 'GirarGrados', 'Numero', 'OpAritmetica']
  },
  // New challenges with new characters
  {
    id: 1001,
    sceneDescriptor: `new EscenaCapySolo("[A,-,-,G]")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'SubirPajarito'],
    expectations: {
        decomposition: false,
        simpleRepetition: false
      }
  },
  {
    id: 1046,
    sceneDescriptor: `new EscenaCapy("\
      [A,-,L],\
      [-,_,L],\
      [-,_,_],\
      [-,-,L],\
      [L,_,L],")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'RecogerLata', 'Procedimiento'],
    expectations: {
      simpleRepetition: false,
      decomposition: false,
      decomposition9: true
    }
  },
  //Tecnopolis
  {
    id: 202101,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,P,-,-,-],\
    [-,-,O,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,-],\
  ")`,
    toolboxStyle: 'noCategories',
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
      <statement name="program">
        <shadow type="required_statement"></shadow>
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="MoverACasillaDerecha">
                  <next>
                    <block type="MoverACasillaAbajo">
                      <next>
                        <block type="ComerChurrasco"></block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  },
  {
    id: 202102,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,P,-,-,-],\
    [-,-,O,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,-],\
  ")`,
    toolboxStyle: 'noCategories',
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <shadow type="required_statement"></shadow>
        <block type="repetir">
          <value name="count">
            <shadow type="required_value"></shadow>
            <block type="math_number">
              <field name="NUM">3</field>
            </block>
          </value>
          <statement name="block">
            <shadow type="required_statement"></shadow>
            <block type="MoverACasillaDerecha"></block>
          </statement>
          <next>
            <block type="MoverACasillaAbajo">
              <next>
                <block type="ComerChurrasco"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`
  },
  //Duba
  {
    id: 2021001,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,O,O,-,-],\
    [-,-,O,O,-,P],\
    [-,-,-,-,-,P],\
    [-,-,-,-,-,-],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021002,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,-,-,-,-],\
    [-,-,O,-,-,-],\
    [-,-,-,O,-,-],\
    [-,-,-,-,O,P],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021003,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,O,O,O,O,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,O,O],\
    [-,-,-,-,-,P],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021004,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [-,P,-,-,-,-],\
    [-,-,P,-,-,-],\
    [-,-,-,P,-,-],\
    [-,-,-,-,P,-],\
    [-,-,-,-,-,-],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021005,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,P],\
    [-,O,O,O,O,-],\
    [-,-,-,-,O,-],\
    [O,O,-,-,O,-],\
    [-,O,O,-,-,-],\
    [-,-,O,-,-,P],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021006,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [-,O,P,O,P,O],\
    [-,O,P,O,P,O],\
    [-,O,P,O,P,O],\
    [-,O,P,O,P,O],\
    [-,O,P,-,P,O],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021007,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,O],\
    [-,O,O,O,-,O],\
    [-,O,P,O,-,O],\
    [-,O,-,-,-,O],\
    [-,O,O,O,O,O],\
    [-,-,-,-,-,-],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021008,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'ComerChurrasco',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaDuba("\
    [A,-,-,-,-,-],\
    [O,O,-,-,O,O],\
    [-,O,-,-,O,-],\
    [-,-,-,-,-,-],\
    [O,O,-,-,O,O],\
    [P,-,-,-,-,P],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  //Lita
  {
    id: 2021101,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,-,-,-,-,-],\
    [-,-,-,-,-,-],\
    [-,-,O,O,-,-],\
    [-,-,O,O,-,-],\
    [-,-,-,-,-,E],\
    [L,-,-,-,-,T],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021102,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,-,-,-,-,-],\
    [O,-,-,-,-,-],\
    [-,O,-,L,-,-],\
    [-,-,O,T,L,-],\
    [-,-,-,O,T,-],\
    [-,-,-,-,O,E],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021103,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,-,-,-,-,T],\
    [O,O,O,O,O,-],\
    [-,-,-,-,-,-],\
    [-,-,-,-,-,L],\
    [-,-,-,-,O,O],\
    [-,-,-,-,-,E],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021104,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,L,-,-,-,-],\
    [-,T,L,-,-,-],\
    [-,-,T,L,-,-],\
    [-,-,-,T,L,-],\
    [-,-,-,-,T,-],\
    [-,-,-,-,-,E],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021105,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,T,T,T,T,T],\
    [-,O,O,O,O,L],\
    [-,-,-,-,O,L],\
    [O,O,-,-,O,L],\
    [-,O,O,-,O,L],\
    [-,-,O,E,-,L],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021106,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,-,L,-,-,E],\
    [-,O,L,O,T,O],\
    [-,O,L,O,T,O],\
    [-,O,L,O,T,O],\
    [-,O,L,O,T,O],\
    [-,O,-,-,T,O],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021107,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,L,L,L,L,O],\
    [-,O,O,O,-,O],\
    [-,O,E,O,-,O],\
    [-,O,-,T,T,O],\
    [-,O,O,O,O,O],\
    [-,-,-,-,-,-],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  {
    id: 2021108,
    toolboxBlockIds: [
      'MoverACasillaAbajo',
      'MoverACasillaArriba',
      'MoverACasillaIzquierda',
      'MoverACasillaDerecha',
      'AgarrarTomate',
      'AgarrarLechuga',
      'PrepararEnsalada',
      'Repetir'
    ],
    sceneDescriptor: `new EscenaLita("\
    [A,-,L,-,-,-],\
    [O,O,-,-,O,O],\
    [-,O,-,-,O,-],\
    [-,-,-,-,-,-],\
    [O,O,-,-,O,O],\
    [T,-,-,-,-,E],\
  ")`,
    toolboxStyle: 'noCategories',
  },
  //Coty
  {
    id: 2021201, //Copy of 207
    sceneDescriptor: `new EscenaCoty(
      [{x:125,y:75},{x:125,y:-175},{x:-25,y:-175},{x:-25,y:-75},{x:25,y:-75},{x:25,y:-175},{x:-125,y:-175},{x:-125,y:125},{x:-75,y:125},{x:-75,y:75},{x:-25,y:75},{x:-25,y:125},{x:25,y:125},{x:25,y:75}],
      [{x:25,y:75},{x:75,y:75},{x:75,y:125},{x:125,y:125},{x:125,y:75}],
      {xCoty: 25, yCoty: 75}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando']
  },
  {
    id: 2021202, //Copy of 209
    sceneDescriptor: `new EscenaCoty(
      [],
      [[ {x:-125,y:0}, {x:-75,y:0}],[ {x:-25,y:0}, {x:25,y:0}],[ {x:75,y:0}, {x:125,y:0}]],
      {xCoty: 125, yCoty: 0}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 2021203, //Copy of 213
    sceneDescriptor: `new EscenaCotyMate()`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: ['MoverArribaDibujando', 'MoverAbajoDibujando', 'MoverDerechaDibujando', 'MoverIzquierdaDibujando', 'SaltarAbajo', 'SaltarArriba', 'SaltarDerecha', 'SaltarIzquierda']
  },
  {
    id: 2021204, //Copy of 233
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-130,y:20},{x:-90,y:20}], [{x:-50,y:20},{x:-10,y:20}], [{x:30,y:20},{x:70,y:20}], [{x:110,y:20},{x:150,y:20}]],
      {xCoty: -130, yCoty: 20, longitudSegmento: 40}     
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 2021205, //Copy of 235
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-120,y:-60},{x:-120,y:-20},{x:-80,y:-20},{x:-40,y:-20},{x:-40,y:20},{x:0,y:20},{x:40,y:20},{x:40,y:60},{x:80,y:60},{x:120,y:60}]],
      {xCoty: -120, yCoty: -60, longitudSegmento: 40}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 2021206,
    sceneDescriptor: `new EscenaCoty(
      [[{x:-104,y:12},{x:-78,y:12}],[{x:-104,y:12},{x:-104,y:-30}],[{x:-104,y:-9},{x:-78,y:-9}],[{x:-104,y:-30},{x:-78,y:-30}],[{x:-70,y:12},{x:-44,y:12}],[{x:-70,y:12},{x:-70,y:-30},{x:-44,y:-30}],[{x:-36,y:12},{x:-36,y:-30}],[{x:-36,y:12},{x:-30,y:4},{x:-28,y:0},{x:-19,y:-12},{x:-17,y:-16},{x:-14,y:-19},{x:-8,y:-27}],[{x:-10,y:12},{x:-10,y:-30}],[{x:-2,y:12},{x:24,y:12}],[{x:-2,y:12},{x:-2,y:-30}],[{x:24,y:12},{x:24,y:-30}],[{x:-2,y:-30},{x:24,y:-30}],[{x:32,y:12},{x:58,y:12}],[{x:32,y:12},{x:32,y:-30}],[{x:32,y:-9},{x:58,y:-9}],[{x:58,y:12},{x:58,y:-12}],[{x:66,y:12},{x:92,y:12}],[{x:66,y:12},{x:66,y:-30}],[{x:92,y:12},{x:92,y:-30}],[{x:66,y:-30},{x:92,y:-30}],[{x:100,y:12},{x:100,y:-30},{x:126,y:-30}],[{x:142,y:12},{x:142,y:-30}],[{x:150,y:12},{x:176,y:12}],[{x:150,y:12},{x:150,y:-12}],[{x:150,y:-9},{x:176,y:-9},{x:176,y:-33}],[{x:150,y:-30},{x:176,y:-30}]],
      [[{x:-180,y:70},{x:-80,y:70}],[{x:-130,y:70},{x:-130,y:-30}]],
      {xCoty: -130, yCoty: 70}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  {
    id: 2021207,
    sceneDescriptor: `new EscenaCoty(
      [],
      [[{x:-150,y:0},{x:-150,y:50},{x:-100,y:50},{x:-100,y:0}],[{x:-100,y:-50},{x:-50,y:-50}],[{x:-50,y:0},{x:-50,y:50},{x:0,y:50},{x:0,y:0}],[{x:0,y:-50},{x:50,y:-50}],[{x:50,y:0},{x:50,y:50},{x:100,y:50},{x:100,y:0}],[{x:100,y:-50},{x:150,y:-50}]],
      {xCoty: -150, yCoty: 0}
    )`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverArribaDibujando',
      'MoverAbajoDibujando',
      'MoverDerechaDibujando',
      'MoverIzquierdaDibujando',
      'SaltarAbajo',
      'SaltarArriba',
      'SaltarDerecha',
      'SaltarIzquierda',
      'Repetir'
    ]
  },
  //Toto
  {
    id: 2021301, //Copy of 225
    sceneDescriptor: `new EscenaTotoLector([
        ['A', 'r', 'e'],
        ['t', 'o', 'j'],
        ['i', 't', 'o'],
    ], "toto")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021302, //Copy of 226
    sceneDescriptor: `new EscenaTotoLector([
        ['r', 'h', 'j', 'a'],
        ['z', 'A', 'a', 'm'],
        ['y', 'l', 'l', 'q']
    ], "llama")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021303, //Copy of 227
    sceneDescriptor: `new EscenaTotoLector([
        ['a', 'm', 'A'],
        ['f', 'u', 'p'],
        ['r', 'y', 'a'],
    ], "puma")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021304, //Copy of 229
    sceneDescriptor: `new EscenaTotoLector([
        ['w', 'a', 'r'],
        ['u', 'n', 'e'],
        ['l', 'A', 's'],
    ], "lunes", 7)`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverLeyendoIzquierda">
        <next>
        <block type="MoverLeyendoArriba">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoArriba">
        <next>
        <block type="MoverLeyendoDerecha">
        <next>
        <block type="MoverLeyendoAbajo">
        <next>
        <block type="MoverLeyendoAbajo">
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
        </next>
        </block>
      </statement>
      </block>
    </xml>`,
  },
  {
    id: 2021305,
    sceneDescriptor: `new EscenaTotoLector([
        ['A','t', 'e', 'l', 'j'],
        ['i','s', 'c', 'n', 'o'],
        ['l','o', 'p', 'o', 'v'],
    ], "tecnopolis")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
    ],
  },
  {
    id: 2021306,
    sceneDescriptor: `new EscenaTotoLector([
        ['d','A','o'],
        ['z','n','a'],
        ['g','e','c'],
        ['r','u','d'],
        ['w','q','t'],
        ['x','u','a'],
        ['j','e','r'],
        ['y','n','v']
    ], "neuquen")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
  },
  {
    id: 2021307,
    sceneDescriptor: `new EscenaTotoLector([
        ['d','A','o'],
        ['z','n','a'],
        ['g','e','c'],
        ['r','u','d'],
        ['w','q','t'],
    ], "neuquen")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
  },
  {
    id: 2021308,
    sceneDescriptor: `new EscenaTotoLector([
      ['t','a','q','m','e','v','o','g','r','a','u'],
      ['n','A','s','a','n','t','a','c','r','u','a'],
      ['f','d','i','u','v','r','e','o','h','z','d'],
    ], "santacruz")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
  },
  {
    id: 2021309,
    sceneDescriptor: `new EscenaTotoLector([
      ['f','d','h','w','t'],
      ['e','a','z','b','u'],
      ['r','x','h','u','y'],
      ['t','A','c','i','k'],
    ], "chubut")`,
    toolboxStyle: 'noCategories',
    toolboxBlockIds: [
      'MoverLeyendoAbajo',
      'MoverLeyendoArriba',
      'MoverLeyendoIzquierda',
      'MoverLeyendoDerecha',
      'Repetir'
    ],
    debugging: true,
    predefinedSolution: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="269" y="15">
      <statement name="program">
        <shadow type="required_statement"></shadow>
        <block type="repetir">
          <value name="count">
            <shadow type="required_value"></shadow>
            <block type="math_number">
              <field name="NUM">3</field>
            </block>
          </value>
          <statement name="block">
            <shadow type="required_statement"></shadow>
            <block type="MoverLeyendoArriba">
              <next>
                <block type="MoverLeyendoDerecha"></block>
                </next>
                </block>
                </statement>
                </block>
                </statement>
                </block>
                </xml>`
  },
  {
    id: 1002,
    sceneDescriptor: 'ChuyHaciendoJueguito',
    toolboxBlockIds: ['Avanzar', 'Retroceder', 'RecogerPulpito', 'RebotarPiePulpito', 'RevolearPulpito', 'Procedimiento'],
    expectations: {
      simpleRepetition: false
    }
  },  
  {
    id: 1003,
    sceneDescriptor: 'NoMeCansoDeRebotar',
    toolboxBlockIds: ['RebotarUnaVezPingPong', 'Procedimiento', 'Repetir'],
    expectations: {
      decomposition: false
    }
  },
    {
    id: 1004,
    sceneDescriptor: `new EscenaManic("\
                    [E,-,E,-,E],\
                    [-,-,-,-,E],\
                    [-,-,-,-,E],\
                    [A,E,E,-,-],")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ObservarEstrella', 'Procedimiento', 'Repetir']
  },
  {
    id: 1005,
    sceneDescriptor: `new EscenaYvoty("\
    [-,-,-,L,-,-],\
    [-,-,L,-,-,L],\
    [-,L,-,-,L,-],\
    [L,-,-,L,-,-],\
    [A,-,L,-,-,-],\
    ")`,
    toolboxBlockIds: ['DespertarLuciernaga', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir']
  },
  {
    id: 1006,
    sceneDescriptor: `new EscenaChuy("\
      [T,-,-,-,-,-],\
      [-,T,-,-,-,-],\
      [-,-,T,-,-,-],\
      [-,-,-,T,-,-],\
      [A,-,-,-,T,-],\
      ")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'RecogerTrofeo', 'Procedimiento', 'Repetir']
  },
  {
    id: 1007,
    sceneDescriptor: `new EscenaManic("\
        [-,T,T,T,T],\
        [-,T,T,T,T],\
        [-,T,T,T,T],\
        [A,T,T,T,T],")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaArriba', 'VolverABordeIzquierdo', 'RepararTelescopio', 'Procedimiento', 'Repetir']
  },  
  {
    id: 1008,
    sceneDescriptor: `new EscenaManic("\
    [P,P,P,P,P,P],\
    [P,-,-,-,-,-],\
    [P,P,P,P,P,P],\
    [P,-,-,-,-,-],\
    [A&P,P,P,P,P,P],")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ObservarPlaneta', 'Procedimiento', 'Repetir']
  },
  {
    id: 1009,
    sceneDescriptor: `new EscenaYvoty("\
      [C,C,C,C,-],\
      [-,-,-,-,K],\
      [-,-,-,-,-],\
      [A,C,C,C,-],")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'CargarCelular', 'AgarrarCargador', 'Procedimiento', 'Repetir']
  },
  {
    id: 1010,
    sceneDescriptor: 'InstalandoJuegosYvoty',
    toolboxBlockIds: ['PasarASiguienteComputadora', 'PrenderComputadora', 'ApagarComputadora', 'EscribirC', 'EscribirB', 'EscribirA', 'InstalarJuego', 'Repetir', 'Procedimiento'],
  },
  {
    id: 1011,
    sceneDescriptor: 'EscapeEnYacare',
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'AgarrarTelescopio', 'EntregarTelescopio', 'EntregarPelota', 'EntregarCargador', 'IrseEnYacare', 'Repetir', 'Procedimiento'],
    expectations: {
      decomposition: true,
    },
  },
  {
    id: 1012,
    sceneDescriptor: 'LimpiandoElHumedal',
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'TomarLata', 'TomarPapel', 'Colocar', 'IrseEnYacare', 'Repetir', 'Procedimiento'],
  },
  {
    id: 1013,
    sceneDescriptor: `new EscenaChuy("[A,G?]",{},[1,0])`,
    toolboxBlockIds: ['PatearPelotaChuy', 'MoverACasillaDerecha', 'TocandoPelotaChuy', 'Repetir', 'Procedimiento', 'Si'],
    expectations: {
      conditionalAlternative: true,
      decomposition: false
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 1014,
    sceneDescriptor: `new EscenaChuy(["[A,P]", "[A,G]"])`,
    toolboxBlockIds: ['PatearPelotaChuy', 'RebotarPingPong', 'MoverACasillaDerecha', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoPelotaChuy', 'TocandoPingPong'],
    expectations: {
      conditionalAlternative: true,
      decomposition: false
    },
    shouldShowMultipleScenarioHelp: true
  },
  {
    id: 1015,
    sceneDescriptor: `new EscenaChuy(['[A,+]', '[A],[+]'])`,
    toolboxBlockIds: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'MoverACasillaDerecha',
      'MoverACasillaAbajo', 'TocandoDerecha', 'TocandoAbajo'],
    expectations: {
      conditionalAlternative: true,
      decomposition: false
    }
  },
  {
    id: 1016,
    sceneDescriptor: `new EscenaManic("[A,T?,T?,T?]",{},[3,0])`,
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaDerecha', 'RepararTelescopio', 'Repetir', 'Si', 'SiNo', 'TocandoTelescopio'],
  },
  {
    id: 1017,
    sceneDescriptor: `new EscenaYvoty("\
        [A&(*>L?)],\
        [*>L?],\
        [*>L?],\
        [*>L?],\
        [*>L?],\
        [*>L?],\
        [-],",
        { coleccion: ["L"] }, [0,6])`,
    toolboxBlockIds: ['DespertarLuciernaga', 'MoverACasillaAbajo', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoLuciernaga']
  },
  {
    id: 1018,
    sceneDescriptor: `new EscenaChuy([
      '[A,_,_,_,_,_,_,_],[-,-,-,_,_,_,_,_],[_,_,-,_,_,_,_,_],[_,_,-,_,_,_,_,_],[_,_,-,-,-,-,-,_],[_,_,_,_,_,_,-,_],[_,_,_,_,_,_,-,-],[_,_,_,_,_,_,_,-]',
      '[A,-,-,_,_,_,_,_],[_,_,-,-,-,_,_,_],[_,_,_,_,-,-,_,_],[_,_,_,_,_,-,_,_],[_,_,_,_,_,-,-,_],[_,_,_,_,_,_,-,-],[_,_,_,_,_,_,_,-],[_,_,_,_,_,_,_,-]',
      '[A,_,_,_,_,_,_,_],[-,_,_,_,_,_,_,_],[-,-,_,_,_,_,_,_],[_,-,_,_,_,_,_,_],[_,-,-,_,_,_,_,_],[_,_,-,-,_,_,_,_],[_,_,_,-,_,_,_,_],[_,_,_,-,-,-,-,-]',
      '[A,_,_,_,_,_,_,_],[-,_,_,_,_,_,_,_],[-,_,_,_,_,_,_,_],[-,_,_,_,_,_,_,_],[-,-,-,-,_,_,_,_],[_,_,_,-,-,_,_,_],[_,_,_,_,-,_,_,_],[_,_,_,_,-,-,-,-]',
      '[A,-,-,-,-,_,_,_],[_,_,_,_,-,_,_,_],[_,_,_,_,-,_,_,_],[_,_,_,_,-,_,_,_],[_,_,_,_,-,-,_,_],[_,_,_,_,_,-,-,_],[_,_,_,_,_,_,-,_],[_,_,_,_,_,_,-,-]']
      ,{},[7,7])`,
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
      'Repetir', 'Si', 'SiNo', 'PuedeMoverAbajo', 'PuedeMoverDerecha'],
  },
  {
    id: 1019,
    sceneDescriptor: `new EscenaYvoty(["[A&L],[L],[+]","[A&L],[L],[L],[+]","[A&L],[L],[L],[L],[+]", "[A&L],[L],[L],[L],[L],[+]", "[A&L],[L],[L],[L],[L],[L],[+]"])`,
    toolboxBlockIds: ['Procedimiento', 'DespertarLuciernaga', 'MoverACasillaAbajo',
      'TocandoMeta', 'Repetir', 'Si', 'SiNo', 'Hasta'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 1020,
    sceneDescriptor: `new EscenaYvoty(["[A&(#L)],[#L],[+]","[A&(#L)],[#L],[#L],[+]","[A&(#L)],[#L],[#L],[#L],[+]", "[A&(#L)],[#L],[#L],[#L],[#L],[+]", "[A&(#L)],[#L],[#L],[#L],[#L],[#L],[+]"],
      { macros: { "L": "*>L?" }, coleccion: ["L"] })`,
    toolboxBlockIds: ['Procedimiento', 'TocandoMeta', 'TocandoLuciernaga', 'DespertarLuciernaga',
      'MoverACasillaAbajo', 'Repetir', 'Si', 'SiNo', 'Hasta'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 1021,
    sceneDescriptor: `new EscenaChuy([
      '[A&(U?),_,_,_,_],[U?,U?,_,_,_],[_,U?,U?,_,_],[_,_,U?,_,_],[_,_,U?,U?,+]',
      '[A&(U?),_],[U?,+]',
      '[A&(U?),_,_],[U?,_,_],[U?,_,_],[U?,U?,_],[_,U?,U?],[_,_,+]',
      '[A&(U?),U?,U?,_,_],[_,_,U?,_,_],[_,_,U?,U?,+]',
      '[A&(U?),U?,U?,U?,U?,_,_,_],[_,_,_,_,U?,_,_,_],[_,_,_,_,U?,_,_,_],[_,_,_,_,U?,_,_,_],[_,_,_,_,U?,U?,_,_],[_,_,_,_,_,U?,U?,_],[_,_,_,_,_,_,U?,_],[_,_,_,_,_,_,U?,+]'
     ],{})`,
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaAbajo',
      'PatearPulpito', 'Repetir', 'Si', 'SiNo', 'Hasta', 'PuedeMoverAbajo',
      'PuedeMoverDerecha', 'TocandoMeta', 'TocandoPulpito'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 1022,
    sceneDescriptor: `new EscenaCapySolo("\
        [*,*,*,*,*],\
      ", { coleccion: ["G", "A"] })`,
    toolboxBlockIds: ['Repetir', 'Si', 'SiNo', 'Hasta', 'Procedimiento',
      'VolverAlBordeIzquierdo', 'MoverACasillaDerecha', 'TocandoGuyra','SubirPajarito'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 1023,
    sceneDescriptor: 'FutbolAlSur',
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'SiguienteFila',
      'PatearPelotaChuy', 'TocandoInicio', 'TocandoPelotaChuy', 'Repetir', 'Si',
      'SiNo', 'Hasta'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 1024,
    sceneDescriptor: `new EscenaYvoty([
      '[A,T,T,T,-], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [-,T,T,T,-]',
      '[A,T,T,T,T,-], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [-,T,T,T,T,-]',
      '[A,T,T,T,T,T,-], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [-,T,T,T,T,T,-]',
      '[A,T,T,T,-], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [-,T,T,T,-]',
      '[A,T,T,T,T,T,-], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [-,T,T,T,T,T,-]',
      '[A,T,T,T,-], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [-,T,T,T,-]',
      '[A,T,T,T,T,-], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [-,T,T,T,T,-]',
      '[A,T,T,T,T,T,-], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [-,T,T,T,T,T,-]'
    ])`,
    toolboxBlockIds: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'MoverACasillaDerecha', 'MoverACasillaArriba',
      'MoverACasillaAbajo', 'MoverACasillaIzquierda',
      'PrenderComputadora', 'EstoyEnEsquina'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 1025,
    sceneDescriptor: 'ContandoPlanetasYEstrellas',
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
      'SiguienteColumna', 'ContarPlaneta', 'ContarEstrella',
      'TocandoPlaneta', 'TocandoEstrellaManic', 'Repetir', 'Si', 'SiNo',
      'Hasta', 'EstoySobreElInicioManic', 'EstoySobreElFinalManic'],
    expectations: {
      conditionalRepetition: true,
    }
  },
  {
    id: 1026,
    sceneDescriptor: 'SuperMaraton',
    toolboxBlockIds: ['Procedimiento', 'KmsTotales', 'Avanzar1kmChuy', 'RepetirVacio',
      'Repetir', 'Si', 'SiNo', 'Hasta'],
    expectations: {
      decomposition: false
    }
  },  
  {
    id: 1027,
    sceneDescriptor: 'ContandoDeNuevoManic',
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaArriba', 'MoverACasillaAbajo',
      'SiguienteColumna',
      'ContarPlaneta', 'ContarEstrella', 'TocandoPlaneta',
      'TocandoEstrellaManic', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'EstoySobreElInicioManic', 'LargoColumnaActual']
  },  
  {
    id: 1028,
    sceneDescriptor: `new EscenaCapy("\
        [-,L,L,-,-],\
        [-,L,L,L,L],\
        [-,L,-,-,-],\
        [A,L,L,L,-],")`,
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba',
      'VolverAlBordeIzquierdo', 'RecogerLata', 'RepetirVacio', 'Repetir', 'Si',
      'SiNo', 'Hasta', 'Numero'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 1029,
    sceneDescriptor: 'DibujandoCuadradoManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero']
  },
  {
    id: 1030,
    sceneDescriptor: 'Dibujando5CuadradosHorizontalManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 1031,
    sceneDescriptor: 'Dibujando5CuadradosDiagonalManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 1032,
    sceneDescriptor: 'Dibujando4CuadradosInterioresManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 1033,
    sceneDescriptor: 'DibujandoCabezaElefanteManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'SaltarHaciaAdelante']
  },
  {
    id: 1034,
    sceneDescriptor: 'DibujandoHexagonoManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 1035,
    sceneDescriptor: 'DibujandoTrianguloEquilateroManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 1036,
    sceneDescriptor: 'DibujandoPoligonosInterioresManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 1037,
    sceneDescriptor: 'DibujandoCuevaEstalagtitasManic',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante']
  },
  {
    id: 1038,
    sceneDescriptor: `new EscenaManic([
      '[A,_,_,_,_],[-,O,-,-,-],[-,_,_,_,-],[E,-,-,-,-]',
      '[A,_,_,_,_],[-,-,-,-,-],[O,_,_,_,-],[E,-,-,-,-]'])`,
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'MoverACasillaIzquierda',
      'ObservarEstrella', 'Repetir', 'Si', 'SiNo', 
      'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha']
  },
  {
    id: 1039,
    sceneDescriptor: `new EscenaManic([
      '[A,_,_,_,_,_],[-,O,-,-,-,_],[-,_,_,_,-,_],[-,-,-,-,-,_],[-,_,_,_,_,_],[-,-,O,-,-,-],[_,-,_,_,_,-],[_,E,-,-,-,-]',
      '[A,_,_,_,_,_],[-,O,-,-,-,_],[-,_,_,_,-,_],[-,-,-,-,-,_],[-,_,_,_,_,_],[-,-,-,-,-,-],[_,O,_,_,_,-],[_,E,-,-,-,-]',
      '[A,_,_,_,_,_],[-,-,-,-,-,_],[O,_,_,_,-,_],[-,-,-,-,-,_],[-,_,_,_,_,_],[-,-,O,-,-,-],[_,-,_,_,_,-],[_,E,-,-,-,-]',
      '[A,_,_,_,_,_],[-,-,-,-,-,_],[O,_,_,_,-,_],[-,-,-,-,-,_],[-,_,_,_,_,_],[-,-,-,-,-,-],[_,O,_,_,_,-],[_,E,-,-,-,-]'])`,
    toolboxBlockIds: ['Procedimiento', 'MoverACasillaDerecha', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'MoverACasillaIzquierda',
      'ObservarEstrella', 'Repetir', 'Si', 'SiNo', 
      'HayObstaculoArriba', 'HayObstaculoAbajo', 'HayObstaculoIzquierda', 'HayObstaculoDerecha'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 1040,
    sceneDescriptor: `new EscenaCapy([
      '[L,-,-,-,A],[_,_,-,_,_],[_,_,-,_,_],[_,_,-,_,_]',
      '[L,-,L,-,A],[_,_,L,_,_],[_,_,L,_,_],[_,_,L,_,_]'])`,
    toolboxBlockIds: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'RecogerLata', 'TocandoLata']
  },
  {
    id: 1041,
    sceneDescriptor: `new EscenaCapy([
      '[_,_,_,-,-,L,A],[L,-,-,L,_,L,_],[L,_,_,L,_,L,_],[L,_,_,L,_,L,_],[L,_,_,L,_,_,_]',
      '[_,_,_,-,-,L,A],[-,-,-,L,_,L,_],[-,_,_,L,_,L,_],[-,_,_,L,_,L,_],[-,_,_,L,_,_,_]',
      '[_,_,_,-,-,L,A],[L,-,-,-,_,L,_],[L,_,_,-,_,L,_],[L,_,_,-,_,L,_],[L,_,_,-,_,_,_]',
      '[_,_,_,-,-,-,A],[L,-,-,L,_,-,_],[L,_,_,L,_,-,_],[L,_,_,L,_,-,_],[L,_,_,L,_,_,_]'])`,
    toolboxBlockIds: ['Procedimiento', 'Repetir', 'Si', 'SiNo', 'MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaAbajo', 'MoverACasillaArriba', 'RecogerLata', 'TocandoLata'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 1042,
    sceneDescriptor: `new EscenaCapy("\
      [A,L|P|-,L|P|-,L|P|-,L|P|-],\
      [-,_,_,_,_],\
      [-,L|P|-,L|P|-,L|P|-,L|P|-],\
      [-,_,_,_,_],\
      [-,_,_,_,_],\
      [-,L|P|-,L|P|-,L|P|-,L|P|-],")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'RecogerLata', 'RecogerPapel', 'Procedimiento', 'Repetir', 'TocandoLata', 'TocandoPapel', 'Si', 'SiNo'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 1043,
    sceneDescriptor: `new EscenaYvoty("\
    [_,P,P?,P?],\
      [_,_,_,P?],\
      [-,P,P?,P?],\
      [-,_,_,_],\
      [P,P?,P?,_],\
      [_,_,P?,_],\
      [P,P?,P?,_],\
      [A,_,_,_],",{})`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'DesbloquearCelular', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoCelular'],
    expectations: {
      decomposition: false,
      decomposition9: true
    }
  },
  {
    id: 1044,
    sceneDescriptor: `new EscenaManic("\
    [A,-,-,-,-],\
    [E|P,_,E|P,E|P,E|P],\
    [E|P,_,E|P,E|P,E|P],\
    [E|P,_,E|P,E|P,E|P],\
    [E|P,_,E|P,E|P,E|P],\
    [E|P,_,E|P,E|P,E|P],\
    [E|P,_,E|P,E|P,E|P],")`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaIzquierda', 'MoverACasillaArriba', 'MoverACasillaAbajo', 'ObservarEstrella', 'ObservarPlaneta', 'Procedimiento', 'Repetir', 'Si', 'SiNo', 'TocandoEstrellaManic', 'TocandoPlaneta']
  },
  {
    id: 1045,
    sceneDescriptor: `new EscenaYvoty("\
      [-,*a>M?,*a>M?,*a>M?,*a>M?],\
      [-,*b>M?,*b>M?,*b>M?,*b>M?],\
      [-,*c>M?,*c>M?,*c>M?,*c>M?],\
      [-,-,-,-,-],\
      [-,*d>M?,*d>M?,*d>M?,*d>M?],\
      [-,*e>M?,*e>M?,*e>M?,*e>M?],\
      [A,*f>M?,*f>M?,*f>M?,*f>M?],",
      { colecciones: {
          a: ["M", "M"],
          b: ["M", "M"],
          c: ["M", "M"],
          d: ["M", "M"],
          e: ["M", "M"],
          f: ["M", "M"]
      }})`,
    toolboxBlockIds: ['MoverACasillaDerecha', 'MoverACasillaArriba', 'VolverABordeIzquierdo', 'FotografiarMariposa', 'TocandoMariposa', 'Procedimiento', 'Repetir', 'Si', 'SiNo']
  },
  {
    id: 1130,
    sceneDescriptor: 'BuscandoLasEstrellas',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'Numero',
      'OpAritmetica', 'MoverTelescopio', 'SiguienteTelescopio', 'ObservarConAmigos'],
  },
  {
    id: 1131,
    sceneDescriptor: 'ReciclandoPapeles',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta', 'MoverACasillaDerecha', 'TomarPapel', 'Colocar', 'SiguienteFilaTotal', 'Numero', 'OpAritmetica'],
  },
  {
    id: 1132,
    sceneDescriptor: `new EscenaYvoty([
      '[A,T,T,T,-], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [-,T,T,T,-]',
      '[A,T,T,T,T,-], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [-,T,T,T,T,-]',
      '[A,T,T,T,T,T,-], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [-,T,T,T,T,T,-]',
      '[A,T,T,T,-], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [-,T,T,T,-]',
      '[A,T,T,T,T,T,-], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [-,T,T,T,T,T,-]',
      '[A,T,T,T,-], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [T,-,-,-,T], [-,T,T,T,-]',
      '[A,T,T,T,T,-], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [T,-,-,-,-,T], [-,T,T,T,T,-]',
      '[A,T,T,T,T,T,-], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [T,-,-,-,-,-,T], [-,T,T,T,T,T,-]'
    ])`,
    toolboxBlockIds: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
      'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'PrenderComputadora', 'EstoyEnEsquina', 'Numero',
      'OpAritmetica'],
  },
  {
    id: 1133,
    sceneDescriptor: `new EscenaYvoty("\
    [A,#M,#M,#M,#M,#M,-],\
    [#M,O,O,O,O,O,#M],\
    [#M,O,_,_,_,O,#M],\
    [#M,O,_,_,_,O,#M],\
    [#M,O,_,_,_,O,#M],\
    [#M,O,O,O,O,O,#M],\
    [-,#M,#M,#M,#M,#M,-],",
    { macros: { "M": "*>M?" }, coleccion: ["M"] })`,
    toolboxBlockIds: ['ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo',
      'MoverA', 'Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'TocandoMariposa', 'FotografiarMariposa', 'Numero', 'OpAritmetica'],
  },
   {
    id: 1134,
    sceneDescriptor: `new EscenaChuy("\
    [A,T,T,T,T,-],\
    [T,_,_,_,_,T],\
    [T,T,T,T,T,T],\
    [T,_,_,_,_,T],\
    [-,T,T,T,T,-],\
    ")`,
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo', 'MoverA',
      'RecogerTrofeo', 'Numero', 'OpAritmetica']
  },
  {
    id: 1135,
    sceneDescriptor: 'PaleteandoConParametros',
    toolboxBlockIds: ['Procedimiento', 'RepetirVacio', 'Repetir', 'Si', 'SiNo', 'Hasta',
      'TocandoPingPong', 'RebotarPingPong',
      'MoverACasillaAbajo', 'MoverACasillaArriba', 'MoverACasillaIzquierda', 'MoverACasillaDerecha',
      'Numero', 'OpComparacion', 'OpAritmetica',
      'ParaLaDerecha', 'ParaLaIzquierda', 'ParaArriba', 'ParaAbajo'
    ]
  },
  {
    id: 1136,
    sceneDescriptor: `DibujandoLibrementeManic`,
    hasAutomaticGrading: false,
    toolboxBlockIds: ['Procedimiento', 'Repetir', 'DibujarLado',
      'GirarGrados', 'Numero', 'OpAritmetica', 'SaltarHaciaAdelante'],
    expectations: {
      decomposition: false,
      simpleRepetition: false
    }
  },
]
