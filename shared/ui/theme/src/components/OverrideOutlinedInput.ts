import type {CSSObject, Theme} from '@mui/material'
import type {Components} from '@mui/material/styles'

export function OverrideOutlinedInput(theme: Theme): Components['MuiOutlinedInput'] {
  function baseInputStyle(): CSSObject {
    const {textSm: fontStyleBodySm} = theme.typography
    const {grey, error, primary, background} = theme.palette
    const {sm: radiusSm} = theme.radius
    const {focusPrimary100, focusError100} = theme.shadowCustom
    const inputBackgroundColor = background.paper

    return {
      ...fontStyleBodySm,
      fontWeight: 500,
      color: grey[700],
      ':not(.Mui-error):not(.Mui-readOnly):hover, &.Mui-focused': {
        input: {
          '&::placeholder': {
            color: grey[700],
          },
        },
        textarea: {
          '&::placeholder': {
            color: grey[700],
          },
        },
        fieldset: {
          borderColor: `${grey[200]}`,
        },
      },
      input: {
        backgroundColor: inputBackgroundColor,
        borderRadius: radiusSm,
        padding: '10px 16px',
        '&::placeholder': {
          ...fontStyleBodySm,
          color: grey[500],
          opacity: 1,
        },
      },
      textarea: {
        backgroundColor: inputBackgroundColor,
        borderRadius: radiusSm,
        padding: '10px 16px',
        '&::placeholder': {
          ...fontStyleBodySm,
          color: grey[500],
          opacity: 1,
        },
      },
      fieldset: {
        border: '1px solid',
        borderColor: grey[200],
        borderRadius: radiusSm,
      },
      '&.Mui-error': {
        fieldset: {
          borderColor: `${error[300]}`,
        },
        svg: {
          color: `${error[500]}`,
        },
      },
      '&.Mui-focused.Mui-error': {
        fieldset: {
          borderColor: `${error[300]}`,
          borderWidth: '1px ',
          boxShadow: focusError100,
        },
        svg: {
          color: `${error[500]}`,
        },
      },

      '&.Mui-focused:not(.Mui-readOnly) input[aria-invalid="false"] ~ fieldset': {
        borderColor: `${primary[300]}`,
        borderWidth: '1px',
        boxShadow: focusPrimary100,
      },
      '&.Mui-focused:not(.Mui-readOnly) textarea[aria-invalid="false"] ~ fieldset': {
        borderColor: `${primary[300]}`,
        borderWidth: '1px ',
        boxShadow: focusPrimary100,
      },

      '&.Mui-readOnly, &.Mui-readOnly.Mui-focused': {
        backgroundColor: `${grey[100]}`,
        input: {
          backgroundColor: `${grey[100]}`,
        },
        textarea: {
          backgroundColor: `${grey[100]}`,
        },
        fieldset: {
          borderColor: `${grey[200]}`,
          borderWidth: '1px',
        },
      },
    }
  }

  function textAreaStyle(): CSSObject {
    return {
      '&.MuiInputBase-multiline': {
        padding: 0,
      },
    }
  }

  return {
    styleOverrides: {
      root: {
        ...baseInputStyle(),
        ...textAreaStyle(),
      },
    },
  }
}
