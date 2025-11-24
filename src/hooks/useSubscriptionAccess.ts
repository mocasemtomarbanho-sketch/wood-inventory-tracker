import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export interface SubscriptionStatus {
  hasAccess: boolean;
  isLoading: boolean;
  subscription: any;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
  daysRemaining: number;
}

export const useSubscriptionAccess = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    hasAccess: false,
    isLoading: true,
    subscription: null,
    isTrialActive: false,
    isSubscriptionActive: false,
    daysRemaining: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          checkAccess();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setStatus({
          hasAccess: false,
          isLoading: false,
          subscription: null,
          isTrialActive: false,
          isSubscriptionActive: false,
          daysRemaining: 0,
        });
        return;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!subscription) {
        setStatus({
          hasAccess: false,
          isLoading: false,
          subscription: null,
          isTrialActive: false,
          isSubscriptionActive: false,
          daysRemaining: 0,
        });
        return;
      }

      const now = new Date();
      const isTrialActive = subscription.status === 'trial' && 
        subscription.trial_ends_at && 
        new Date(subscription.trial_ends_at) > now;
      
      const isSubscriptionActive = subscription.status === 'active' && 
        subscription.expires_at && 
        new Date(subscription.expires_at) > now;

      const hasAccess = isTrialActive || isSubscriptionActive;

      let daysRemaining = 0;
      if (isTrialActive && subscription.trial_ends_at) {
        const trialEnd = new Date(subscription.trial_ends_at);
        daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      } else if (isSubscriptionActive && subscription.expires_at) {
        const subEnd = new Date(subscription.expires_at);
        daysRemaining = Math.ceil((subEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }

      setStatus({
        hasAccess,
        isLoading: false,
        subscription,
        isTrialActive,
        isSubscriptionActive,
        daysRemaining,
      });
    } catch (error) {
      console.error('Error checking subscription access:', error);
      setStatus({
        hasAccess: false,
        isLoading: false,
        subscription: null,
        isTrialActive: false,
        isSubscriptionActive: false,
        daysRemaining: 0,
      });
    }
  };

  const redirectToPlans = () => {
    navigate('/planos');
  };

  return { ...status, refreshAccess: checkAccess, redirectToPlans };
};
