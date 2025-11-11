/**
 * OAuth Authentication Helpers
 * Handles Google Sign In using Expo AuthSession
 */

import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from './supabase'

WebBrowser.maybeCompleteAuthSession()

/**
 * Get OAuth redirect URI for mobile
 */
export const getRedirectUri = () => {
  // For Expo Go development
  const redirectUri = makeRedirectUri({
    scheme: 'kanahhealth10',
  })
  
  console.log('📱 OAuth Redirect URI:', redirectUri)
  return redirectUri
}

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const redirectUri = getRedirectUri()
    console.log('🔵 Starting Google OAuth with redirect:', redirectUri)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true, // We handle the browser ourselves
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account', // Forces account selection every time
        },
      },
    })

    if (error) {
      console.error('❌ OAuth initiation error:', error)
      throw error
    }

    if (!data?.url) {
      throw new Error('No OAuth URL returned from Supabase')
    }

    console.log('🔗 OAuth URL:', data.url)

    // Open the OAuth URL in browser
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUri
    )

    console.log('📥 Browser result:', result.type)

    if (result.type === 'success' && result.url) {
      const url = result.url
      console.log('✅ Success URL:', url)
      
      // PKCE flow returns a code, not tokens directly
      const queryParams = new URLSearchParams(url.split('?')[1] || '')
      const code = queryParams.get('code')

      if (code) {
        console.log('🔑 Got authorization code, exchanging for session...')
        
        // Exchange the code for a session
        const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

        if (sessionError) {
          console.error('❌ Code exchange error:', sessionError)
          throw sessionError
        }
        
        if (!sessionData.session) {
          throw new Error('No session returned from code exchange')
        }
        
        console.log('✅ Session created successfully')
        return { success: true, session: sessionData.session }
      } else {
        // Try legacy flow (direct tokens in hash)
        const hashParams = new URLSearchParams(url.split('#')[1] || '')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken && refreshToken) {
          console.log('🎟️ Got direct tokens, setting session')
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error('❌ Session error:', sessionError)
            throw sessionError
          }
          
          console.log('✅ Session set successfully')
          return { success: true, session: sessionData.session }
        }
        
        console.error('❌ No code or tokens in URL')
        throw new Error('No authentication code or tokens received')
      }
    } else if (result.type === 'cancel') {
      return { success: false, error: 'User cancelled' }
    }

    throw new Error('OAuth flow did not complete successfully')
  } catch (error: any) {
    console.error('❌ Google OAuth error:', error)
    return { success: false, error: error.message }
  }
}

// Apple Sign In removed - will implement later if needed

