import { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  registerWithEmail,
  requestPasswordReset,
  signInWithEmail,
  signOutCurrentUser,
  subscribeToAuthSession,
} from './auth-service';

type AuthMode = 'login' | 'register';

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return 'Something went wrong. Please try again.';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account already exists for this email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email address or password is incorrect.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/weak-password':
      return 'Use a password with at least six characters.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export function AuthPrototypeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToAuthSession((nextUser) => {
      setUser(nextUser);
      setIsSessionReady(true);
    });
  }, []);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  }

  async function submit() {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Enter your email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Use a password with at least six characters.');
      return;
    }

    if (mode === 'register') {
      if (!displayName.trim()) {
        setErrorMessage('Enter your name.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('The passwords do not match.');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      if (mode === 'register') {
        await registerWithEmail(displayName, email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetPassword() {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Enter your email address first.');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      setSuccessMessage('Password reset email sent.');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setErrorMessage(null);

    try {
      setIsSubmitting(true);
      await signOutCurrentUser();
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isSessionReady) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#171717" size="large" />
      </SafeAreaView>
    );
  }

  if (user) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.sessionContent}>
          <Text style={styles.brand}>Shopicom</Text>
          <Text style={styles.sessionTitle}>
            Welcome{user.displayName ? `, ${user.displayName}` : ''}
          </Text>
          <Text style={styles.sessionEmail}>{user.email}</Text>
          <Text style={styles.sessionStatus}>Your session is active.</Text>

          {errorMessage ? (
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>
              {errorMessage}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={logout}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Log out</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>Shopicom</Text>
          <Text style={styles.heading}>
            {mode === 'login' ? 'Login' : 'Create account'}
          </Text>
          <Text style={styles.supportingText}>
            {mode === 'login'
              ? 'Sign in with your development account.'
              : 'Register a development account.'}
          </Text>

          <View accessibilityRole="tablist" style={styles.modeControl}>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'login' }}
              onPress={() => changeMode('login')}
              style={[
                styles.modeButton,
                mode === 'login' && styles.modeButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'login' && styles.modeButtonTextSelected,
                ]}
              >
                Login
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'register' }}
              onPress={() => changeMode('register')}
              style={[
                styles.modeButton,
                mode === 'register' && styles.modeButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'register' && styles.modeButtonTextSelected,
                ]}
              >
                Register
              </Text>
            </Pressable>
          </View>

          {mode === 'register' ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                autoCapitalize="words"
                autoComplete="name"
                editable={!isSubmitting}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor="#737373"
                style={styles.input}
                value={displayName}
              />
            </View>
          ) : null}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              editable={!isSubmitting}
              inputMode="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#737373"
              style={styles.input}
              value={email}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              editable={!isSubmitting}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor="#737373"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>

          {mode === 'register' ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!isSubmitting}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                placeholderTextColor="#737373"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
              />
            </View>
          ) : null}

          {errorMessage ? (
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>
              {errorMessage}
            </Text>
          ) : null}
          {successMessage ? (
            <Text accessibilityLiveRegion="polite" style={styles.successText}>
              {successMessage}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={submit}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {mode === 'login' ? 'Login' : 'Register'}
              </Text>
            )}
          </Pressable>

          {mode === 'login' ? (
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              hitSlop={8}
              onPress={resetPassword}
              style={styles.textButton}
            >
              <Text style={styles.textButtonLabel}>Forgot password?</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  },
  formContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sessionContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    color: '#171717',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 18,
  },
  heading: {
    color: '#171717',
    fontSize: 34,
    fontWeight: '700',
  },
  supportingText: {
    color: '#525252',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  modeControl: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 6,
    padding: 4,
    marginBottom: 28,
    marginTop: 24,
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  modeButtonSelected: {
    backgroundColor: '#FFFFFF',
  },
  modeButtonText: {
    color: '#525252',
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonTextSelected: {
    color: '#171717',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#262626',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    color: '#171717',
    fontSize: 16,
    paddingHorizontal: 14,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#171717',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  textButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textButtonLabel: {
    color: '#171717',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionTitle: {
    color: '#171717',
    fontSize: 30,
    fontWeight: '700',
  },
  sessionEmail: {
    color: '#525252',
    fontSize: 16,
    marginTop: 8,
  },
  sessionStatus: {
    color: '#166534',
    fontSize: 14,
    marginBottom: 28,
    marginTop: 12,
  },
});
