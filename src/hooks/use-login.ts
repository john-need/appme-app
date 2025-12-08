import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from './index'
import { setCredentials } from '../features/auth/auth-slice'
import { addNotification } from '../features/notification/notification-slice'
import auth from '../data-layer/auth'

export function useLogin() {
  const dispatch = useAppDispatch()

  const mutation = useMutation(async ({ email, password }: { email: string; password: string }) => {
    return auth(email, password)
  }, {
    onSuccess(data) {
      const jwt = data?.token ?? data?.jwt ?? data
      const user = data?.user ?? null
      dispatch(setCredentials({ jwt, user }))
    },
    onError(error: any) {
      const message = error?.message ?? 'Login failed'
      dispatch(addNotification({ id: String(Date.now()), message, severity: 'error' }))
    }
  })

  const login = useCallback((email: string, password: string) => mutation.mutate({ email, password }), [mutation])

  return { ...mutation, login }
}
