import React from 'react'
import { Card, CardContent, Typography, Button, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { increment, decrement } from '../../features/counter/counter-slice'

export default function CounterCard() {
  const count = useAppSelector((s) => s.counter.value)
  const dispatch = useAppDispatch()

  return (
    <Card sx={{ maxWidth: 360, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h6">Counter</Typography>
        <Typography variant="h4">{count}</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => dispatch(increment())}>
            +
          </Button>
          <Button variant="outlined" onClick={() => dispatch(decrement())}>
            -
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

