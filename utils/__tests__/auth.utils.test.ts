import { getFirebaseAuthError } from '../auth.utils';

describe('getFirebaseAuthError', () => {
  it('maps invalid-credential to generic auth message', () => {
    expect(getFirebaseAuthError({ code: 'auth/invalid-credential' })).toBe(
      'Invalid email or password.',
    );
  });

  it('maps user-not-found to generic auth message', () => {
    expect(getFirebaseAuthError({ code: 'auth/user-not-found' })).toBe(
      'Invalid email or password.',
    );
  });

  it('maps wrong-password to generic auth message', () => {
    expect(getFirebaseAuthError({ code: 'auth/wrong-password' })).toBe(
      'Invalid email or password.',
    );
  });

  it('maps invalid-email to specific message', () => {
    expect(getFirebaseAuthError({ code: 'auth/invalid-email' })).toBe('Invalid email address.');
  });

  it('maps email-already-in-use to specific message', () => {
    expect(getFirebaseAuthError({ code: 'auth/email-already-in-use' })).toBe(
      'An account with this email already exists.',
    );
  });

  it('maps weak-password to specific message', () => {
    expect(getFirebaseAuthError({ code: 'auth/weak-password' })).toBe(
      'Password must be at least 6 characters.',
    );
  });

  it('maps too-many-requests to specific message', () => {
    expect(getFirebaseAuthError({ code: 'auth/too-many-requests' })).toBe(
      'Too many attempts. Please try again later.',
    );
  });

  it('returns fallback for unknown error codes', () => {
    expect(getFirebaseAuthError({ code: 'auth/unknown-code' })).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('returns fallback for errors without a code', () => {
    expect(getFirebaseAuthError(new Error('network error'))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('returns fallback for null', () => {
    expect(getFirebaseAuthError(null)).toBe('Something went wrong. Please try again.');
  });
});
