import React from 'react'
import { Container, Box, Typography } from '@mui/material'
import CounterCard from '../components/counter-card/counter-card'

export default function HomePage() {
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to AppMe
        </Typography>
        <Typography variant="body1" gutterBottom>
          Material UI, Redux Toolkit and React Query are configured.
        </Typography>
        <CounterCard />
      </Box>
    </Container>
  )
}

