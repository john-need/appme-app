import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import App from '../app'
import { store } from '../store/root-store'

const queryClient = new QueryClient()
const theme = createTheme()

test('renders app header', () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )

  const banner = screen.getByRole('banner')
  expect(within(banner).getByText(/appme/i)).toBeInTheDocument()
})
