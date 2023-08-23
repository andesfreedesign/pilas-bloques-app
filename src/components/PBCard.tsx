import { Paper, PaperProps, useMediaQuery } from "@mui/material";
import { theme } from "../theme/theme";

type PBCardProps = {
    children: React.ReactNode
}

export const PBCard = (props: PBCardProps & PaperProps) => {
    const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'));
    
    return <Paper 
        {...props} 
        elevation={3} 
        sx={{ ...props.sx, backgroundColor: theme.palette.background.default, display: 'flex', alignItems: 'center', margin: theme.spacing(isSmallScreen?0.5:1)}}>
            {props.children}
    </Paper>
}