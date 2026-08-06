import { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { AuthenticatedApp } from '../app/AuthenticatedApp';

type AuthMode = 'login' | 'register';
type LoginMethod = 'phone' | 'email';
type RegistrationMethod = 'phone' | 'email';

const registrationAssets = {
  background: require('../../../assets/auth/ellipse.svg.png'),
  google: require('../../../assets/auth/google-mark.png'),
  lock: require('../../../assets/auth/lock-line.svg.png'),
  mail: require('../../../assets/auth/mail-line.svg.png'),
  user: require('../../../assets/auth/user-3-line.svg.png'),
};

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
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [registrationMethod, setRegistrationMethod] =
    useState<RegistrationMethod>('phone');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
    if (nextMode === 'register') {
      setRegistrationMethod('phone');
    } else {
      setLoginMethod('phone');
    }
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  }

  function changeRegistrationMethod(nextMethod: RegistrationMethod) {
    setRegistrationMethod(nextMethod);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function changeLoginMethod(nextMethod: LoginMethod) {
    setLoginMethod(nextMethod);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function showGooglePendingMessage() {
    setSuccessMessage(null);
    setErrorMessage(
      'Google sign-in will be available after the company OAuth setup is complete.',
    );
  }

  async function submitRegistration() {
    if (registrationMethod === 'email') {
      await submit();
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!displayName.trim()) {
      setErrorMessage('Enter your name.');
      return;
    }

    if (phoneNumber.replace(/\D/g, '').length < 9) {
      setErrorMessage('Enter a valid Ghana phone number.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Use a password with at least six characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('The passwords do not match.');
      return;
    }

    setErrorMessage(
      'Phone registration is not enabled in Firebase yet. Use Register with Email below for now.',
    );
  }

  async function submitLogin() {
    if (loginMethod === 'email') {
      await submit();
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    if (phoneNumber.replace(/\D/g, '').length < 9) {
      setErrorMessage('Enter a valid Ghana phone number.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Use a password with at least six characters.');
      return;
    }

    setErrorMessage(
      'Phone login is not enabled in Firebase yet. Use Login with Email below for now.',
    );
  }

  async function handleLoginPasswordReset() {
    if (loginMethod === 'phone') {
      changeLoginMethod('email');
      setErrorMessage('Enter your email address, then tap Forget Password again.');
      return;
    }

    await resetPassword();
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
      <AuthenticatedApp
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onLogout={logout}
        user={user}
      />
    );
  }

  if (mode === 'register') {
    return (
      <SafeAreaView style={styles.registrationScreen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.registrationScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.registrationCanvas}>
              <View pointerEvents="none" style={styles.registrationArtContainer}>
                <Image
                  resizeMode="contain"
                  source={registrationAssets.background}
                  style={styles.registrationArt}
                />
              </View>

              <View style={styles.registrationContent}>
                <Text style={styles.registrationHeading}>Register</Text>
                <View style={styles.registrationAccountRow}>
                  <Text style={styles.registrationAccountText}>
                    Already have an account?
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => changeMode('login')}
                  >
                    <Text style={styles.registrationLoginLink}>Login</Text>
                  </Pressable>
                </View>

                <View style={styles.registrationFields}>
                  <View style={styles.registrationInputShell}>
                    <Image
                      resizeMode="contain"
                      source={registrationAssets.user}
                      style={styles.registrationFieldIcon}
                    />
                    <TextInput
                      autoCapitalize="words"
                      autoComplete="name"
                      editable={!isSubmitting}
                      onChangeText={setDisplayName}
                      placeholder="Enter your name"
                      placeholderTextColor="rgba(0, 0, 0, 0.25)"
                      style={styles.registrationInput}
                      value={displayName}
                    />
                  </View>

                  <View style={styles.registrationInputShell}>
                    {registrationMethod === 'phone' ? (
                      <Text
                        numberOfLines={1}
                        style={styles.registrationPhonePrefix}
                      >
                        +233
                      </Text>
                    ) : (
                      <Image
                        resizeMode="contain"
                        source={registrationAssets.mail}
                        style={styles.registrationFieldIcon}
                      />
                    )}
                    <TextInput
                      autoCapitalize="none"
                      autoComplete={
                        registrationMethod === 'phone' ? 'tel' : 'email'
                      }
                      editable={!isSubmitting}
                      inputMode={
                        registrationMethod === 'phone' ? 'tel' : 'email'
                      }
                      keyboardType={
                        registrationMethod === 'phone'
                          ? 'phone-pad'
                          : 'email-address'
                      }
                      onChangeText={
                        registrationMethod === 'phone'
                          ? setPhoneNumber
                          : setEmail
                      }
                      placeholder={
                        registrationMethod === 'phone'
                          ? 'Enter Phone Number'
                          : 'Enter Email Address'
                      }
                      placeholderTextColor="rgba(0, 0, 0, 0.25)"
                      style={styles.registrationInput}
                      value={
                        registrationMethod === 'phone' ? phoneNumber : email
                      }
                    />
                  </View>

                  <View style={styles.registrationInputShell}>
                    <Image
                      resizeMode="contain"
                      source={registrationAssets.lock}
                      style={styles.registrationFieldIconMuted}
                    />
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="new-password"
                      editable={!isSubmitting}
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      placeholderTextColor="rgba(0, 0, 0, 0.25)"
                      secureTextEntry
                      style={styles.registrationInput}
                      value={password}
                    />
                  </View>

                  <View style={styles.registrationInputShell}>
                    <Image
                      resizeMode="contain"
                      source={registrationAssets.lock}
                      style={styles.registrationFieldIconMuted}
                    />
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="new-password"
                      editable={!isSubmitting}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm password"
                      placeholderTextColor="rgba(0, 0, 0, 0.25)"
                      secureTextEntry
                      style={styles.registrationInput}
                      value={confirmPassword}
                    />
                  </View>
                </View>

                {errorMessage ? (
                  <Text
                    accessibilityLiveRegion="polite"
                    style={styles.registrationErrorText}
                  >
                    {errorMessage}
                  </Text>
                ) : null}
                {successMessage ? (
                  <Text
                    accessibilityLiveRegion="polite"
                    style={styles.registrationSuccessText}
                  >
                    {successMessage}
                  </Text>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  disabled={isSubmitting}
                  onPress={submitRegistration}
                  style={({ pressed }) => [
                    styles.registrationPrimaryButton,
                    pressed && styles.buttonPressed,
                    isSubmitting && styles.buttonDisabled,
                  ]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.registrationPrimaryButtonText}>
                      Register
                    </Text>
                  )}
                </Pressable>

                <View style={styles.registrationDividerRow}>
                  <View style={styles.registrationDivider} />
                  <Text style={styles.registrationDividerLabel}>
                    CONTINUE WITH
                  </Text>
                  <View style={styles.registrationDivider} />
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={showGooglePendingMessage}
                  style={({ pressed }) => [
                    styles.registrationAlternativeButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={registrationAssets.google}
                    style={styles.registrationGoogleIcon}
                  />
                  <Text style={styles.registrationAlternativeLabel}>
                    GOOGLE
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    changeRegistrationMethod(
                      registrationMethod === 'phone' ? 'email' : 'phone',
                    )
                  }
                  style={({ pressed }) => [
                    styles.registrationAlternativeButton,
                    styles.registrationEmailButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={registrationAssets.mail}
                    style={styles.registrationMailIcon}
                  />
                  <Text style={styles.registrationAlternativeLabel}>
                    {registrationMethod === 'phone'
                      ? 'REGISTER WITH EMAIL'
                      : 'REGISTER WITH PHONE'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.loginScreen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.loginScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.loginCanvas}>
            <View pointerEvents="none" style={styles.loginArtContainer}>
              <Image
                accessible={false}
                resizeMode="contain"
                source={registrationAssets.background}
                style={styles.loginArt}
              />
            </View>

            <View style={styles.loginContent}>
              <Text style={styles.loginHeading}>Login</Text>
              <View style={styles.loginAccountRow}>
                <Text style={styles.loginAccountText}>
                  Don't have an account yet?
                </Text>
                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => changeMode('register')}
                >
                  <Text style={styles.loginRegisterLink}>Register</Text>
                </Pressable>
              </View>

              <View style={styles.loginFields}>
                <View style={styles.registrationInputShell}>
                  {loginMethod === 'phone' ? (
                    <Text
                      numberOfLines={1}
                      style={styles.registrationPhonePrefix}
                    >
                      +233
                    </Text>
                  ) : (
                    <Image
                      accessible={false}
                      resizeMode="contain"
                      source={registrationAssets.mail}
                      style={styles.registrationFieldIcon}
                    />
                  )}
                  <TextInput
                    accessibilityLabel={
                      loginMethod === 'phone' ? 'Phone number' : 'Email address'
                    }
                    autoCapitalize="none"
                    autoComplete={loginMethod === 'phone' ? 'tel' : 'email'}
                    editable={!isSubmitting}
                    inputMode={loginMethod === 'phone' ? 'tel' : 'email'}
                    keyboardType={
                      loginMethod === 'phone' ? 'phone-pad' : 'email-address'
                    }
                    onChangeText={
                      loginMethod === 'phone' ? setPhoneNumber : setEmail
                    }
                    placeholder={
                      loginMethod === 'phone'
                        ? 'Enter Phone Number'
                        : 'Enter Email Address'
                    }
                    placeholderTextColor="rgba(0, 0, 0, 0.25)"
                    style={styles.registrationInput}
                    value={loginMethod === 'phone' ? phoneNumber : email}
                  />
                </View>

                <View style={styles.registrationInputShell}>
                  <Image
                    accessible={false}
                    resizeMode="contain"
                    source={registrationAssets.lock}
                    style={styles.registrationFieldIconMuted}
                  />
                  <TextInput
                    accessibilityLabel="Password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    editable={!isSubmitting}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(0, 0, 0, 0.25)"
                    secureTextEntry
                    style={styles.registrationInput}
                    value={password}
                  />
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                hitSlop={8}
                onPress={handleLoginPasswordReset}
                style={styles.loginForgotButton}
              >
                <Text style={styles.loginForgotLabel}>Forget Password!</Text>
              </Pressable>

              {errorMessage ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={styles.loginErrorText}
                >
                  {errorMessage}
                </Text>
              ) : null}
              {successMessage ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={styles.loginSuccessText}
                >
                  {successMessage}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={submitLogin}
                style={({ pressed }) => [
                  styles.loginPrimaryButton,
                  pressed && styles.buttonPressed,
                  isSubmitting && styles.buttonDisabled,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.registrationPrimaryButtonText}>Login</Text>
                )}
              </Pressable>

              <View style={styles.loginDividerRow}>
                <View style={styles.registrationDivider} />
                <Text style={styles.registrationDividerLabel}>
                  CONTINUE WITH
                </Text>
                <View style={styles.registrationDivider} />
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={showGooglePendingMessage}
                style={({ pressed }) => [
                  styles.registrationAlternativeButton,
                  styles.loginGoogleButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Image
                  accessible={false}
                  resizeMode="contain"
                  source={registrationAssets.google}
                  style={styles.registrationGoogleIcon}
                />
                <Text style={styles.registrationAlternativeLabel}>GOOGLE</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={() =>
                  changeLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')
                }
                style={({ pressed }) => [
                  styles.registrationAlternativeButton,
                  styles.loginEmailButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Image
                  accessible={false}
                  resizeMode="contain"
                  source={registrationAssets.mail}
                  style={styles.registrationMailIcon}
                />
                <Text style={styles.registrationAlternativeLabel}>
                  {loginMethod === 'phone'
                    ? 'LOGIN WITH EMAIL'
                    : 'LOGIN WITH PHONE'}
                </Text>
              </Pressable>
            </View>
          </View>
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
  registrationScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loginScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loginScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loginCanvas: {
    width: '100%',
    maxWidth: 402,
    minHeight: 874,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  loginArtContainer: {
    position: 'absolute',
    left: 66,
    top: -184,
    width: 511,
    height: 508,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginArt: {
    width: 390,
    height: 395,
    transform: [{ rotate: '111.63deg' }],
  },
  loginContent: {
    paddingTop: 160,
    paddingBottom: 48,
    paddingHorizontal: 40,
  },
  loginHeading: {
    color: '#000000',
    fontSize: 40,
    lineHeight: 47,
    fontWeight: '700',
  },
  loginAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 1,
  },
  loginAccountText: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 22,
  },
  loginRegisterLink: {
    color: '#FF2010',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginLeft: 6,
  },
  loginFields: {
    gap: 22,
    marginTop: 20,
  },
  loginForgotButton: {
    minHeight: 44,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginLeft: 9,
    marginTop: 6,
  },
  loginForgotLabel: {
    color: '#071B87',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  loginErrorText: {
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  loginSuccessText: {
    color: '#166534',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  loginPrimaryButton: {
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#FF5A27',
    marginTop: 21,
  },
  loginDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 38,
  },
  loginGoogleButton: {
    marginTop: 19,
  },
  loginEmailButton: {
    marginTop: 26,
  },
  registrationScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  registrationCanvas: {
    width: '100%',
    maxWidth: 402,
    minHeight: 874,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  registrationArtContainer: {
    position: 'absolute',
    left: 66,
    top: -184,
    width: 511,
    height: 508,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registrationArt: {
    width: 390,
    height: 395,
    transform: [{ rotate: '111.63deg' }],
  },
  registrationContent: {
    paddingTop: 78,
    paddingBottom: 48,
    paddingHorizontal: 40,
  },
  registrationHeading: {
    color: '#000000',
    fontSize: 40,
    lineHeight: 47,
    fontWeight: '700',
  },
  registrationAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  registrationAccountText: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 22,
  },
  registrationLoginLink: {
    color: '#FF2010',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginLeft: 8,
  },
  registrationFields: {
    gap: 28,
    marginTop: 27,
  },
  registrationInputShell: {
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    paddingLeft: 24,
    paddingRight: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0.4, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  registrationFieldIcon: {
    width: 24,
    height: 24,
    marginRight: 24,
  },
  registrationFieldIconMuted: {
    width: 24,
    height: 24,
    marginRight: 24,
    opacity: 0.5,
  },
  registrationPhonePrefix: {
    width: 49,
    color: '#000000',
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
    flexShrink: 0,
    marginLeft: -6,
    marginRight: 2,
  },
  registrationInput: {
    flex: 1,
    height: '100%',
    color: '#000000',
    fontSize: 18,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  registrationErrorText: {
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 18,
  },
  registrationSuccessText: {
    color: '#166534',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 18,
  },
  registrationPrimaryButton: {
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#FF5A27',
    marginTop: 56,
  },
  registrationPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '500',
  },
  registrationDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
  },
  registrationDivider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  registrationDividerLabel: {
    color: '#641B04',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    marginHorizontal: 7,
  },
  registrationAlternativeButton: {
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 19,
  },
  registrationEmailButton: {
    marginTop: 26,
  },
  registrationGoogleIcon: {
    width: 32,
    height: 30,
    marginRight: 14,
  },
  registrationMailIcon: {
    width: 24,
    height: 20,
    marginRight: 9,
  },
  registrationAlternativeLabel: {
    color: '#640E08',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
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
