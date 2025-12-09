import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from './index'
import { setCredentials } from '../features/auth/auth-slice'
import { addNotification } from '../features/notification/notification-slice'
import auth from '../data-layer/auth'
import { fetchActivitiesThunk } from '../features/activities/activities-slice'
import { fetchTimeEntriesThunk } from '../features/time-entries/time-entries-slice'

export function useLogin() {
  const dispatch = useAppDispatch()

  const mutation = useMutation(async ({ email, password }: { email: string; password: string }) => {
    return auth(email, password)
  }, {
    onSuccess(data) {
      // `auth` returns an object { token, user }
      const jwt = data.token
      const user = data.user ?? null
      if (user) {
        // Map User -> AuthUser (AuthUser requires id: string)
        const authUser = {
          id: user.id as string,
          name: user.name,
          email: user.email,
          startOfWeek: user.startOfWeek,
          defaultView: user.defaultView,
          timezone: user.timezone,
          created: user.created,
          updated: user.updated
        }
        dispatch(setCredentials({ jwt, user: authUser }))
        // After authentication, load user-related data into the store
        // dispatch thunks to fetch activities and time entries
        try {
          dispatch(fetchActivitiesThunk() as any)
        } catch (e) {
          // ignore; fetchActivitiesThunk handles its own errors and notifications
        }
        try {
          dispatch(fetchTimeEntriesThunk() as any)
        } catch (e) {
          // ignore
        }
      } else {
        dispatch(setCredentials({ jwt, user: null }))
      }
    },
    onError(error: any) {
      const message = error?.message ?? 'Login failed'
      dispatch(addNotification({ id: String(Date.now()), message, severity: 'error' }))
    }
  })

  const login = useCallback((email: string, password: string) => mutation.mutate({ email, password }), [mutation])

  return { ...mutation, login }
}
