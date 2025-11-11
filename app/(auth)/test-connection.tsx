/**
 * Database Connection Test Screen
 * 
 * This screen provides a UI to test the Supabase database connection
 * and verify that environment variables are properly configured.
 * 
 * Usage: Navigate to this screen to test your database setup
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { ArrowLeft, Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react-native'
import { testDatabaseConnection, type ConnectionTestResult } from '@/lib/database'
import { getSession, getCurrentUser } from '@/lib/supabase'

export default function TestConnectionScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ConnectionTestResult | null>(null)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  const runTest = async () => {
    setIsLoading(true)
    setResult(null)
    setSessionInfo(null)

    try {
      // Test database connection
      const testResult = await testDatabaseConnection()
      setResult(testResult)

      // Get session info
      const session = await getSession()
      const user = await getCurrentUser()

      setSessionInfo({
        hasSession: !!session,
        hasUser: !!user,
        userEmail: user?.email || 'Not signed in',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResult({
        success: false,
        message: 'Test failed with exception',
        error: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const showDetailsAlert = () => {
    if (!result) return

    Alert.alert(
      result.success ? '✅ Success' : '❌ Error',
      `Message: ${result.message}\n\n` +
        (result.error ? `Error: ${result.error}\n\n` : '') +
        (result.timestamp ? `Time: ${new Date(result.timestamp).toLocaleString()}` : ''),
      [{ text: 'OK' }]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 p-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
        >
          <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Database Test
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header Card */}
          <View className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-6 mb-6">
            <View className="items-center">
              <Database size={48} className="text-blue-600 dark:text-blue-400 mb-3" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Supabase Connection Test
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Verify your database connection and configuration
              </Text>
            </View>
          </View>

          {/* Test Button */}
          <TouchableOpacity
            onPress={runTest}
            disabled={isLoading}
            className={`flex-row items-center justify-center bg-blue-600 rounded-xl py-4 px-6 mb-6 ${
              isLoading ? 'opacity-50' : ''
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <RefreshCw size={20} className="text-white mr-2" />
                <Text className="text-white font-semibold text-base">
                  Run Connection Test
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Results */}
          {result && (
            <View className="space-y-4">
              {/* Status Card */}
              <TouchableOpacity
                onPress={showDetailsAlert}
                className={`rounded-xl p-5 border-2 ${
                  result.success
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                    : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                }`}
              >
                <View className="flex-row items-start">
                  {result.success ? (
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400 mr-3" />
                  ) : (
                    <XCircle size={24} className="text-red-600 dark:text-red-400 mr-3" />
                  )}
                  <View className="flex-1">
                    <Text
                      className={`font-semibold text-base mb-1 ${
                        result.success
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}
                    >
                      {result.success ? 'Connected Successfully!' : 'Connection Failed'}
                    </Text>
                    <Text
                      className={`text-sm ${
                        result.success
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}
                    >
                      {result.message}
                    </Text>
                    {result.error && (
                      <Text className="text-xs text-red-600 dark:text-red-400 mt-2">
                        {result.error}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Session Info */}
              {sessionInfo && (
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                  <Text className="font-semibold text-base text-gray-900 dark:text-white mb-3">
                    Session Information
                  </Text>
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Has Active Session:
                      </Text>
                      <Text className="text-sm font-medium text-gray-900 dark:text-white">
                        {sessionInfo.hasSession ? 'Yes' : 'No'}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        User Authenticated:
                      </Text>
                      <Text className="text-sm font-medium text-gray-900 dark:text-white">
                        {sessionInfo.hasUser ? 'Yes' : 'No'}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Email:
                      </Text>
                      <Text className="text-sm font-medium text-gray-900 dark:text-white">
                        {sessionInfo.userEmail}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Timestamp */}
              {result.timestamp && (
                <Text className="text-xs text-gray-500 dark:text-gray-500 text-center">
                  Test completed at {new Date(result.timestamp).toLocaleString()}
                </Text>
              )}
            </View>
          )}

          {/* Instructions */}
          {!result && !isLoading && (
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
              <Text className="font-semibold text-base text-gray-900 dark:text-white mb-3">
                Before Testing:
              </Text>
              <View className="space-y-2">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  1. Create a <Text className="font-mono">.env</Text> file in your project root
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  2. Add your Supabase credentials:
                </Text>
                <View className="bg-gray-900 rounded-lg p-3 mt-2">
                  <Text className="text-xs text-green-400 font-mono">
                    EXPO_PUBLIC_SUPABASE_URL=your_url{'\n'}
                    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  3. Restart your Expo dev server
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  4. Tap "Run Connection Test" above
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

