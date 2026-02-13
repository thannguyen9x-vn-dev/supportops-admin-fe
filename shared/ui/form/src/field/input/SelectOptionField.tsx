'use client'

import type {ComponentProps, ReactElement} from 'react'
import {useCallback, useMemo, useState} from 'react'
import type {FieldPath, FieldPathValue, FieldValues} from 'react-hook-form'
import {useController} from 'react-hook-form'

import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

import type {SelectOption, SelectOptionFieldProps} from './SelectOptionField.types'

function getBorderRadiusPx(value: string | number): number {
  if (typeof value === 'number') return value

  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return 8
  return parsed
}

const textSmStyle = {
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
}

const POPUP_OFFSET: [number, number] = [0, 8]

const StyledTextField = styled(TextField)(({theme}) => {
  const controlHeight = 40
  const baseRadius = getBorderRadiusPx(theme.shape.borderRadius)
  const borderRadius = baseRadius * 3

  const borderColor = theme.palette.grey[300]

  return {
    '& .MuiOutlinedInput-root': {
      minHeight: controlHeight,
      borderRadius,
      backgroundColor: theme.palette.grey[50],
      color: theme.palette.grey[700],
      transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),

      '& fieldset': {
        borderColor,
        borderWidth: 1,
        inset: 0,
      },

      '&:hover fieldset': {
        borderColor,
      },

      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },

      '&.Mui-focused': {
        boxShadow: 'none',
      },

      '&.Mui-focused:not(.Mui-readOnly) input[aria-invalid="false"] ~ fieldset': {
        boxShadow: 'none',
      },

      '& .MuiOutlinedInput-input': {
        ...textSmStyle,
        boxSizing: 'border-box',
        height: controlHeight,
        padding: '10px 16px',
        color: theme.palette.grey[700],
        outline: 'none',
        WebkitTextFillColor: theme.palette.grey[700],
        caretColor: theme.palette.grey[700],

        '&::placeholder': {
          color: theme.palette.grey[500],
          opacity: 1,
        },

        '&:focus': {
          outline: 'none',
        },

        '&:focus-visible': {
          outline: 'none',
        },
      },

      '&.Mui-disabled': {
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.grey[400],

        '& fieldset': {
          borderColor: theme.palette.grey[200],
        },
      },

      '& .MuiOutlinedInput-notchedOutline legend': {
        display: 'none',
      },

      '& .MuiOutlinedInput-notchedOutline': {
        top: 0,
      },
    },
  }
})

const StyledFieldLabel = styled(FormLabel)(({theme}) => ({
  ...textSmStyle,
  display: 'block',
  color: theme.palette.grey[800],
  marginBottom: 6,
}))

const StyledHelperText = styled(FormHelperText)(({theme}) => ({
  marginLeft: 0,
  marginTop: 8,
  ...textSmStyle,
  color: theme.palette.error.main,

  '& .helper-text-title': {
    fontWeight: 700,
    marginRight: 6,
  },
}))

const popupPaperBorderStyles = {
  border: '1px solid var(--mui-palette-grey-300)',
  borderRadius: 3,
  boxShadow: '0px 2px 8px -2px rgba(21, 21, 21, 0.08), 0px 6px 12px -2px rgba(144, 139, 164, 0.08)',
  overflow: 'hidden',
} as const

function SelectOptionFieldInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string | number = Extract<FieldPathValue<TFieldValues, TName>, string | number>,
>(props: SelectOptionFieldProps<TFieldValues, TName, TValue>): ReactElement {
  const {
    name,
    control,
    rules,
    label,
    helperText,
    hideEmptyHelperText = false,
    options,
    searchable = false,
    searchInPopup = false,
    searchPlaceholder,
    noOptionsText,
    disableClearable = true,
    autocompleteProps,
    id,
    disabled,
    placeholder,
    ...textFieldProps
  } = props

  const {
    field,
    fieldState: {error},
  } = useController({
    name,
    control,
    rules,
  })

  const helperTextContent = error?.message ?? helperText
  const showHelper = !hideEmptyHelperText || helperTextContent
  const inputId = id ?? String(name)
  const [open, setOpen] = useState(false)
  const [popupSearchValue, setPopupSearchValue] = useState('')

  const selectedOption = useMemo(() => {
    return options.find(option => option.value === field.value) ?? null
  }, [field.value, options])

  const popupSearchText = popupSearchValue.trim().toLocaleLowerCase()

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(
    (event: unknown, reason: string) => {
      if (searchInPopup && reason === 'blur') return

      setOpen(false)
      setPopupSearchValue('')
      autocompleteProps?.onClose?.(
        event as Parameters<NonNullable<typeof autocompleteProps.onClose>>[0],
        reason as Parameters<NonNullable<typeof autocompleteProps.onClose>>[1],
      )
    },
    [autocompleteProps, searchInPopup],
  )

  const handleClickAway = useCallback(() => {
    if (!searchInPopup) return

    setOpen(false)
    setPopupSearchValue('')
  }, [searchInPopup])

  const handleSelect = useCallback(
    (_: unknown, nextOption: SelectOption<TValue> | null) => {
      if (!nextOption && disableClearable) return

      field.onChange(nextOption?.value ?? '')
      if (searchInPopup) {
        setOpen(false)
        setPopupSearchValue('')
      }
    },
    [disableClearable, field, searchInPopup],
  )

  const mergedPopperSlotProps = useMemo(() => {
    const popperSlotProp = autocompleteProps?.slotProps?.popper

    if (typeof popperSlotProp === 'function') return popperSlotProp

    const existingModifiers = Array.isArray(popperSlotProp?.modifiers)
      ? popperSlotProp.modifiers
      : []

    return {
      ...popperSlotProp,
      modifiers: [
        ...existingModifiers,
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: POPUP_OFFSET,
          },
        },
      ],
    }
  }, [autocompleteProps?.slotProps?.popper])

  const PopupPaper = useCallback(
    (paperProps: ComponentProps<typeof Paper>) => {
      const {children, ...rest} = paperProps

      return (
        <Paper
          {...rest}
          sx={{
            ...popupPaperBorderStyles,
            paddingTop: searchInPopup ? 1 : 0,
          }}
        >
          {searchInPopup ? (
            <>
              <Box sx={{paddingX: 1, paddingBottom: 1}}>
                <TextField
                  autoFocus
                  fullWidth
                  onChange={event => {
                    setPopupSearchValue(event.target.value)
                  }}
                  onKeyDown={event => {
                    event.stopPropagation()
                  }}
                  onMouseDown={event => {
                    event.stopPropagation()
                  }}
                  placeholder={searchPlaceholder}
                  size="small"
                  value={popupSearchValue}
                />
              </Box>
              <Divider />
            </>
          ) : null}
          {children}
        </Paper>
      )
    },
    [popupSearchValue, searchInPopup, searchPlaceholder],
  )

  const autocompleteSx = {
    '& .MuiAutocomplete-inputRoot': {
      padding: '0 !important',
    },
    '& .MuiAutocomplete-input': {
      ...textSmStyle,
      boxSizing: 'border-box',
      height: '40px !important',
      minWidth: 0,
      padding: '10px 16px !important',
    },
    '& .MuiAutocomplete-endAdornment': {
      right: 8,
    },
    '& .MuiAutocomplete-popupIndicator': {
      width: 24,
      height: 24,
      minWidth: 24,
      border: 0,
      borderRadius: 6,
      backgroundColor: 'transparent !important',
      boxShadow: 'none',
      color: 'var(--mui-palette-grey-500)',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'var(--mui-palette-grey-600)',
      },
      '& .MuiSvgIcon-root': {
        fontSize: 28,
      },
    },
    '& .MuiAutocomplete-popupIndicator.Mui-focused': {
      backgroundColor: 'transparent',
    },
    '& .MuiAutocomplete-listbox': {
      maxHeight: 320,
    },
  } as const

  function PopupSearchAutocomplete(): ReactElement {
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{width: '100%'}}>
          <Autocomplete<SelectOption<TValue>, false, boolean, false>
            {...autocompleteProps}
            clearOnBlur={false}
            disableClearable={disableClearable}
            disabled={disabled}
            forcePopupIcon
            fullWidth
            getOptionDisabled={option => Boolean(option.disabled)}
            getOptionKey={option => String(option.value)}
            getOptionLabel={option => option.label}
            id={inputId}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            noOptionsText={noOptionsText}
            onBlur={field.onBlur}
            onChange={handleSelect}
            onClose={handleClose}
            onOpen={event => {
              handleOpen()
              autocompleteProps?.onOpen?.(event)
            }}
            open={open}
            options={options}
            popupIcon={<KeyboardArrowDownRoundedIcon />}
            renderInput={params => (
              <StyledTextField
                {...params}
                {...textFieldProps}
                error={Boolean(error)}
                inputProps={{
                  ...params.inputProps,
                  readOnly: true,
                }}
                onClick={() => {
                  setOpen(prev => !prev)
                }}
                placeholder={placeholder}
                variant="outlined"
              />
            )}
            filterOptions={items => {
              if (!popupSearchText) return items

              return items.filter(option =>
                option.label.toLocaleLowerCase().includes(popupSearchText),
              )
            }}
            selectOnFocus={false}
            slotProps={{
              ...autocompleteProps?.slotProps,
              popupIndicator: {
                ...(autocompleteProps?.slotProps?.popupIndicator ?? {}),
                disableRipple: true,
              },
              popper: mergedPopperSlotProps,
            }}
            slots={{
              ...autocompleteProps?.slots,
              paper: PopupPaper,
            }}
            sx={{
              ...autocompleteSx,
              '& .MuiAutocomplete-input': {
                ...autocompleteSx['& .MuiAutocomplete-input'],
                cursor: 'pointer',
              },
            }}
            value={selectedOption}
          />
        </Box>
      </ClickAwayListener>
    )
  }

  function InlineSearchAutocomplete(): ReactElement {
    return (
      <Autocomplete<SelectOption<TValue>, false, boolean, false>
        {...autocompleteProps}
        clearOnBlur={false}
        disableClearable={disableClearable}
        disabled={disabled}
        forcePopupIcon
        fullWidth
        getOptionDisabled={option => Boolean(option.disabled)}
        getOptionKey={option => String(option.value)}
        getOptionLabel={option => option.label}
        id={inputId}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        noOptionsText={noOptionsText}
        onBlur={field.onBlur}
        onChange={handleSelect}
        options={options}
        popupIcon={<KeyboardArrowDownRoundedIcon />}
        renderInput={params => (
          <StyledTextField
            {...params}
            {...textFieldProps}
            error={Boolean(error)}
            placeholder={searchPlaceholder ?? placeholder}
            variant="outlined"
          />
        )}
        selectOnFocus={false}
        slotProps={{
          ...autocompleteProps?.slotProps,
          popupIndicator: {
            ...(autocompleteProps?.slotProps?.popupIndicator ?? {}),
            disableRipple: true,
          },
        }}
        sx={autocompleteSx}
        value={selectedOption}
      />
    )
  }

  function NativeSelectField(): ReactElement {
    return (
      <StyledTextField
        {...textFieldProps}
        {...field}
        disabled={disabled}
        error={Boolean(error)}
        fullWidth
        id={inputId}
        select
        value={field.value ?? ''}
        variant="outlined"
      >
        {options.map(option => (
          <MenuItem disabled={option.disabled} key={String(option.value)} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledTextField>
    )
  }

  return (
    <Box sx={{width: '100%'}}>
      {label ? (
        <StyledFieldLabel htmlFor={inputId}>
          {label}
        </StyledFieldLabel>
      ) : null}

      {searchable ? (
        searchInPopup ? (
          <PopupSearchAutocomplete />
        ) : (
          <InlineSearchAutocomplete />
        )
      ) : (
        <NativeSelectField />
      )}

      {showHelper ? (
        <StyledHelperText error={Boolean(error)}>
          {error?.message ? (
            <Box component="span">
              <span className="helper-text-title">Oh snap!</span>
              <span>{error.message}</span>
            </Box>
          ) : (
            helperTextContent
          )}
        </StyledHelperText>
      ) : null}
    </Box>
  )
}

export const SelectOptionField = SelectOptionFieldInner as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string | number = Extract<FieldPathValue<TFieldValues, TName>, string | number>,
>(
  props: SelectOptionFieldProps<TFieldValues, TName, TValue>,
) => ReactElement

export default SelectOptionField
