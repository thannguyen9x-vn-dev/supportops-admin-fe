import type {Components} from '@mui/material/styles'

export function OverrideFormLabel(): Components['MuiFormLabel'] {
  return {
    styleOverrides: {
      root: {
        '&.Mui-required': {
          position: 'relative',
          paddingLeft: '8px',
          '.MuiFormLabel-asterisk': {
            position: 'absolute',
            left: 0,
          },
        },
      },
    },
  }
}
