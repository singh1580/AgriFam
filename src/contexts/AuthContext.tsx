
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, Profile, SignUpData } from '@/types/auth';
import { useProfileManager } from '@/hooks/useProfileManager';
import { signUpUser, signInUser, signOutUser } from '@/utils/authHelpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile, fetchProfile, updateProfile: updateUserProfile, clearProfile } = useProfileManager();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Wait longer for new signups to allow the trigger to create the profile
          const delay = event === 'SIGNED_IN' ? 2000 : 1000;
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, delay);
        } else {
          clearProfile();
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, clearProfile]);

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      const { data, error } = await signUpUser(email, password, userData);
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      if (data.user) {
        if (data.user.email_confirmed_at || data.session) {
          toast({
            title: "Account Created!",
            description: "Welcome! Your account has been created successfully.",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account.",
          });
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup exception:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred during signup. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await signInUser(email, password);
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Signin exception:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || "An unexpected error occurred during signin. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await signOutUser();
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setUser(null);
      setSession(null);
      clearProfile();
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('Signout exception:', error);
      toast({
        title: "Sign Out Failed",
        description: error.message || "An unexpected error occurred during signout.",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await updateUserProfile(user.id, updates);
      
      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Profile update exception:', error);
      toast({
        title: "Update Failed",
        description: error.message || "An unexpected error occurred during profile update.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
