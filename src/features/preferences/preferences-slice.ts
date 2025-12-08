import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PaletteMode } from '@mui/material'

interface PreferencesState {
  mode: PaletteMode
}

const initialState: PreferencesState = { mode: 'light' }

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<PaletteMode>) {
      state.mode = action.payload
    },
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    }
  }
})

export const { setMode, toggleMode } = preferencesSlice.actions
export default preferencesSlice.reducer

