import { Box, Stack } from "@mui/material"
import { Ember } from "../../../emberCommunication"
import { LocalStorage } from "../../../localStorage"
import { EMBER_IMPORTED_CHALLENGE_PATH } from "../../ImportedChallengeView"
import { EmberView } from "../../emberView/EmberView"
import { Header, HeaderText } from "../../header/Header"
import { SerializedChallenge } from "../../serializedChallenge"
import { useTranslation } from "react-i18next"
import { CreatorSubHeader } from "./EditorSubHeader/CreatorSubHeader"
import { DownloadButton } from "./ActionButtons/DownloadButton"
import { ReturnToEditionButton } from "./ActionButtons/ReturnToEditButton"
import { DiscardChallengeButton } from "./ActionButtons/DiscardChallengeButton"
import { BetaBadge } from "../BetaBadge"

const ViewModeSubHeader = ({challenge}: {challenge: SerializedChallenge}) =>
    <CreatorSubHeader>
        <Box sx={{ width: "293px" }}>
            <HeaderText text={challenge.title}/>
        </Box>
        <Actions />
    </CreatorSubHeader>

const Actions = () => <>
    <ReturnToEditionButton/>
    <Stack direction="row" alignItems={"center"}>
        <DiscardChallengeButton/>
        <DownloadButton/>
    </Stack>
    </>

export const CreatorViewMode = () => {
    const {t} = useTranslation('creator')

    const challengeBeingEdited: SerializedChallenge = LocalStorage.getCreatorChallenge()!

    Ember.importChallenge(challengeBeingEdited)
    
    return <>
        <Header CenterComponent={<BetaBadge smaller={true}><HeaderText text={t("editor.previewModeHeader")} /></BetaBadge>} SubHeader={<ViewModeSubHeader challenge={challengeBeingEdited}/>}/>
        <EmberView height='calc(100% - var(--creator-subheader-height))' path={EMBER_IMPORTED_CHALLENGE_PATH}/>
    </>
}