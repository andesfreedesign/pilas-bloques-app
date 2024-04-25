import styles from "./PBBlocklyWorkspace.module.css";
import { BlocklyWorkspace } from "react-blockly";
import { useTranslation } from "react-i18next";
import { BlockType, getBlockFromId } from "./blocks";
import { categorizedToolbox, setupBlocklyBlocks, uncategorizedToolbox } from "./blockly";
import { PBCard } from "../PBCard";
import { PaperProps, Typography } from "@mui/material";
import { BlocklyWorkspaceProps } from "react-blockly/dist/BlocklyWorkspaceProps";

export type PBBlocklyWorkspaceProps = {
  blockIds: string[]
  categorized: boolean
  sx?: PaperProps["sx"]
  title?: boolean
} & Partial<BlocklyWorkspaceProps>

export const PBBlocklyWorkspace = ({blockIds, categorized, sx, title, ...props}: PBBlocklyWorkspaceProps) => {
  const {t} = useTranslation("blocks")
    
  const blocksWithCategories: BlockType[] = blockIds.map(getBlockFromId)

  setupBlocklyBlocks(t)

  return <PBCard sx={{...sx}}>
        {title && <Typography>{t('preview')}</Typography>}
        <BlocklyWorkspace
          data-testid={blockIds.join(",")}
          key={blockIds.join("") + categorized} //rerenders on toolbox or categorization changes
          toolboxConfiguration={categorized ? categorizedToolbox(t, blocksWithCategories) : uncategorizedToolbox(blocksWithCategories)}
          workspaceConfiguration={{}}
          onWorkspaceChange={()=>{}}
          onImportXmlError={()=>{}}
          onImportError={()=>{}}
          onXmlChange={()=>{}}
          onJsonChange={()=>{}}
          onInject={()=>{}}
          onDispose={()=>{}}
          className={styles.fill}
          {...props}
        />
      </PBCard>
}
