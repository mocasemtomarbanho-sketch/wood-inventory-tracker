import { ReactNode } from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionGuardProps {
  children: ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { hasAccess, isLoading, isTrialActive, daysRemaining } = useSubscriptionAccess();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      toast.success('Logout realizado com sucesso');
      navigate('/auth');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {!hasAccess && (
        <div className="bg-orange-500 text-white px-4 py-3 text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            <span>
              Seu período de teste expirou. As funcionalidades estão bloqueadas.{' '}
              <button 
                onClick={() => navigate('/planos')}
                className="underline font-bold hover:text-orange-100"
              >
                Assine agora
              </button>
              {' '}para continuar usando o sistema.
            </span>
          </div>
        </div>
      )}
      {hasAccess && isTrialActive && daysRemaining <= 3 && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium">
          ⚠️ Seu período de teste expira em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}.{' '}
          <button 
            onClick={() => navigate('/planos')}
            className="underline font-bold hover:text-orange-100"
          >
            Assine agora
          </button>
          {' '}para manter acesso total.
        </div>
      )}
      {children}
    </>
  );
};
