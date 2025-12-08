import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  name: string
  email: string
  id: string
}

interface AuthState {
  jwt: string | null
  user: AuthUser | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  jwt: null,
  user: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ jwt: string; user: AuthUser }>) {
      state.jwt = action.payload.jwt
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    clearCredentials(state) {
      state.jwt = null
      state.user = null
      state.isAuthenticated = false
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload && !!state.jwt
    },
    setJwt(state, action: PayloadAction<string | null>) {
      state.jwt = action.payload
      state.isAuthenticated = !!action.payload && !!state.user
    }
  }
})

export const { setCredentials, clearCredentials, setUser, setJwt } = authSlice.actions
export default authSlice.reducer

