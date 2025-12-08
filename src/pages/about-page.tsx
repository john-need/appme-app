import React from 'react'
import { Container, Typography } from '@mui/material'

export default function AboutPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>
      <Typography>
        This is a sample app demonstrating React Router with TypeScript, Redux, MUI and React Query.
      </Typography>
    </Container>
  )
}

