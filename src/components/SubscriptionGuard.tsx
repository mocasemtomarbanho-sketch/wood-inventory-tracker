import { ReactNode } from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useNavigate } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { hasAccess, isLoading, isTrialActive, daysRemaining } = useSubscriptionAccess();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
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
