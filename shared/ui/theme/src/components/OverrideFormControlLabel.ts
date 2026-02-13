import type {Theme} from '@mui/material'
import type {Components} from '@mui/material/styles'

export function OverrideFormControlLabel(theme: Theme): Components['MuiFormControlLabel'] {
  return {
    styleOverrides: {
      root: {
        '&.with-checkbox': {
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: theme.palette.grey[100],
          },
          '&.checked': {
            backgroundColor: theme.palette.primary[100],
          },
        },
      },
    },
  }
}
