import type {Theme} from '@mui/material'
import type {Components} from '@mui/material/styles'

export function OverrideInputLabel(theme: Theme): Components['MuiInputLabel'] {
  return {
    styleOverrides: {
      root: {
        fontSize: '12px',
        lineHeight: '15px',
        color: theme.palette.grey[500],
        transform: 'none',
        marginBottom: '4px',
      },
    },
  }
}
