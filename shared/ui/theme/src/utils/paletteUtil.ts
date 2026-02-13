import type {PaletteMode, PaletteOptions} from '@mui/material'
import {blue, green, grey, orange, red, teal} from '../constant/colors'

// Palette mapping follows a common convention (brand colors can override here).
const primary = blue
const error = red
const warning = orange
const success = green
const info = teal
export function getPaletteOptions(mode: PaletteMode): PaletteOptions {
  return {
    mode: mode,
    common: {
      black: '#1A1A1A',
      white: '#FFFFFF',
    },
    action: {
      disabled: grey[300],
    },
    divider: grey[200],
    background: {
      paper: '#FFFFFF',
      default: grey[100],
    },
    grey: {
      ...grey,
      lighter: grey[50],
      light: grey[300],
      main: grey[500],
      dark: grey[600],
      darker: grey[700],
      contrastText: '#FFFFFF',
    },
    primary: {
      ...primary,
      lighter: primary[50],
      light: primary[300],
      main: primary[500],
      dark: primary[600],
      darker: primary[700],
      contrastText: '#FFFFFF',
    },
    error: {
      ...error,
      lighter: error[50],
      light: error[300],
      main: error[500],
      dark: error[600],
      darker: error[700],
      contrastText: '#FFFFFF',
    },
    warning: {
      ...warning,
      lighter: warning[50],
      light: warning[300],
      main: warning[500],
      dark: warning[600],
      darker: warning[700],
      contrastText: '#FFFFFF',
    },
    success: {
      ...success,
      lighter: success[50],
      light: success[300],
      main: success[500],
      dark: success[600],
      darker: success[700],
      contrastText: '#FFFFFF',
    },
    info: {
      ...info,
      lighter: info[50],
      light: info[300],
      main: info[500],
      dark: info[600],
      darker: info[700],
      contrastText: '#FFFFFF',
    },
  }
}
