'use client'

import {CssBaseline, StyledEngineProvider} from '@mui/material'
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles'
import type {PropsWithChildren} from 'react'
import {useMemo} from 'react'
import {createAppTheme} from './createAppTheme'

export function ThemeProvider({children}: PropsWithChildren) {
  const theme = useMemo(() => createAppTheme(), [])
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  )
}
