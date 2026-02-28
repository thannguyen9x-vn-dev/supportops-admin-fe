// AuthCard với sx prop
'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  illustration: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({
  title,
  subtitle,
  illustration,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        borderRadius: 3,
        overflow: 'hidden',
        maxWidth: 900,
        mx: 'auto',
        boxShadow: 4,
        flexDirection: {xs: 'column', md: 'row'},
      }}
    >
      {/* Illustration Panel */}
      <Box
        sx={{
          flex: {md: '0 0 45%'},
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          p: {xs: 4, md: 6},
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.contrastText',
        }}
      >
        {illustration}
      </Box>

      {/* Form Panel */}
      <Box
        sx={{
          flex: 1,
          p: {xs: 4, md: 6},
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
          {children}
        </Box>

        {footer && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              fontSize: '0.875rem',
              color: 'text.secondary',
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {textDecoration: 'underline'},
              },
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Paper>
  )
}