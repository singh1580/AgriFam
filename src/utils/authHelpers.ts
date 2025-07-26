
import { supabase } from '@/integrations/supabase/client';
import { SignUpData } from '@/types/auth';

export const signUpUser = async (email: string, password: string, userData: SignUpData) => {
  console.log('Starting signup process for:', email, userData);
  
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: userData.full_name,
        role: userData.role
      }
    }
  });

  if (error) {
    console.error('Signup error:', error);
    let errorMessage = error.message;
    
    // Provide user-friendly error messages
    if (error.message.includes('already registered')) {
      errorMessage = 'An account with this email already exists. Please sign in instead.';
    } else if (error.message.includes('Password should be')) {
      errorMessage = 'Password must be at least 6 characters long.';
    } else if (error.message.includes('Invalid email')) {
      errorMessage = 'Please enter a valid email address.';
    }
    
    return { data, error: { ...error, message: errorMessage } };
  }

  console.log('Signup successful:', data);
  return { data, error: null };
};

export const signInUser = async (email: string, password: string) => {
  console.log('Starting signin process for:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Signin error:', error);
    let errorMessage = error.message;
    
    // Provide user-friendly error messages
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password. Please check your credentials and try again.';
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Please check your email and click the verification link before signing in.';
    }
    
    return { data, error: { ...error, message: errorMessage } };
  }

  console.log('Signin successful:', data);
  return { data, error: null };
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Signout error:', error);
    return { error };
  }
  return { error: null };
};
