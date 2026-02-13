import React from 'react'
import type {Theme} from '@mui/material'
import type {Components} from '@mui/material/styles'

const RadioDefaultIcon = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
      <g clipPath='url(#clip0_3824_2261)'>
        <rect x='0.5' y='0.5' width='19' height='19' rx='9.5' fill='white' stroke='#CDD7E1' />
      </g>
      <defs>
        <clipPath id='clip0_3824_2261'>
          <rect width='20' height='20' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}

const RadioCheckedIcon = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
      <g clipPath='url(#clip0_3824_2263)'>
        <path
          d='M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10C15 12.7614 12.7614 15 10 15Z'
          fill='#594DE8'
        />
      </g>
      <defs>
        <clipPath id='clip0_3824_2263'>
          <rect width='20' height='20' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}

export function OverrideRadio(theme: Theme): Components['MuiRadio'] {
  const {palette} = theme
  return {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
      disableFocusRipple: true,
      size: 'medium',
      icon: <RadioDefaultIcon />,
      checkedIcon: <RadioCheckedIcon />,
    },
    styleOverrides: {
      root: {
        borderRadius: '8px',
        color: palette.grey[300],
        '&:hover svg rect.radio-default': {
          fill: '#DDDBF9',
          stroke: '#594DE8',
        },
        '&.Mui-disabled .radio-default-disable': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        '&.Mui-disabled .radio-checked-disable': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        '&.Mui-disabled .radio-default': {
          display: 'none',
        },
        '&.Mui-disabled .radio-checked': {
          display: 'none',
        },
        '&.MuiRadio-sizeSmall': {
          padding: '8px',
          '.MuiSvgIcon-root, .icon': {
            fontSize: '16px',
            width: '16px',
            height: '16px',
          },
        },
        '&.MuiRadio-sizeMedium': {
          padding: '8px',
          '.MuiSvgIcon-root, .icon': {
            fontSize: '24px',
            width: '24px',
            height: '24px',
          },
        },
        '&.MuiRadio-sizeLarge': {
          padding: '12px',
          '.MuiSvgIcon-root, .icon': {
            fontSize: '32px',
            width: '32px',
            height: '32px',
          },
        },
      },
    },
  }
}
