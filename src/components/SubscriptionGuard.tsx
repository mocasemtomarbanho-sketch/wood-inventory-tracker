import { ReactNode } from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard } from 'lucide-react';
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

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-6">
              Seu período de teste gratuito de 7 dias expirou. Seus dados estão salvos e seguros,
              mas você precisa assinar para continuar usando o sistema.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/planos')}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Ver Planos e Assinar
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Voltar para Home
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Seus dados estão seguros!</strong> Todos os registros que você criou
              durante o período de teste estão salvos e serão restaurados assim que você assinar.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {isTrialActive && daysRemaining <= 3 && (
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
