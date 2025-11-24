import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Loader2, ArrowLeft, Clock, CreditCard } from "lucide-react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

export default function Planos() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { subscription, isTrialActive, isSubscriptionActive, daysRemaining, refreshAccess } = useSubscriptionAccess();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => authListener.unsubscribe();
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          planId: 'monthly_100',
          userId: user.id 
        }
      });

      if (error) throw error;

      if (data?.paymentUrl) {
        // Redireciona para a página de pagamento do Punshipay
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Erro ao criar pagamento");
      }
    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast.error(error.message || "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = isSubscriptionActive;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {isTrialActive ? 'Seu Período de Teste' : 'Escolha Seu Plano'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isTrialActive 
              ? `Você tem ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'} restantes no seu período de teste gratuito`
              : 'Comece com 7 dias grátis ou assine para acesso ilimitado'
            }
          </p>
        </div>

        {isTrialActive && (
          <Card className="max-w-2xl mx-auto mb-8 p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Período de Teste Ativo</h3>
                <p className="text-muted-foreground mb-4">
                  Você está aproveitando nosso período de teste gratuito de 7 dias com acesso total a todas as funcionalidades.
                  Seus dados estão sendo salvos e continuarão disponíveis após a assinatura.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    Restam {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'} de teste grátis
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="max-w-4xl mx-auto grid md:grid-cols-1 gap-8">
          {!user && (
            <Card className="p-8 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold mb-2">7 Dias Grátis</h4>
                <div className="text-4xl font-bold mb-2">R$ 0</div>
                <p className="text-muted-foreground">Teste completo sem cartão de crédito</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>7 dias de acesso total</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Todas as funcionalidades liberadas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Seus dados salvos e seguros</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Começar Teste Grátis
              </Button>
            </Card>
          )}

          {/* Plano Mensal */}
          <Card className={`p-8 border-2 relative ${hasActiveSubscription ? 'border-green-500' : isTrialActive ? 'border-primary' : 'border-border'}`}>
            {hasActiveSubscription && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  ✓ Assinatura Ativa
                </span>
              </div>
            )}
            {!hasActiveSubscription && isTrialActive && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  🔥 Assine Agora
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold mb-2">Plano Mensal</h4>
              <div className="text-4xl font-bold mb-2">
                R$ 100<span className="text-lg text-muted-foreground">/mês</span>
              </div>
              <p className="text-muted-foreground">Acesso completo e ilimitado</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Acesso ilimitado</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Todas as funcionalidades</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Registros ilimitados</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Relatórios em PDF</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Suporte prioritário</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Atualizações gratuitas</span>
              </li>
            </ul>
            {hasActiveSubscription ? (
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Acessar Dashboard
                </Button>
                {subscription?.expires_at && (
                  <p className="text-sm text-center text-muted-foreground">
                    Válido até {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            ) : isTrialActive ? (
              <div className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Assinar com PIX
                    </>
                  )}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Após o período de teste, suas funcionalidades serão pausadas até a assinatura
                </p>
              </div>
            ) : (
              <Button 
                className="w-full"
                onClick={handleSubscribe}
                disabled={loading || !user}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : !user ? (
                  'Faça login para assinar'
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Assinar com PIX
                  </>
                )}
              </Button>
            )}
          </Card>
        </div>

        {hasActiveSubscription && (
          <div className="text-center mt-8">
            <Card className="p-6 max-w-2xl mx-auto bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">
                ✓ Você está com acesso completo!
              </h3>
              <p className="text-muted-foreground">
                Aproveite todos os recursos ilimitados da plataforma
              </p>
            </Card>
          </div>
        )}

        {!isTrialActive && !hasActiveSubscription && user && (
          <div className="text-center mt-8">
            <Card className="p-6 max-w-2xl mx-auto bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-semibold mb-2 text-orange-700 dark:text-orange-300">
                ⚠️ Período de teste expirado
              </h3>
              <p className="text-muted-foreground mb-4">
                Seu período de 7 dias gratuitos terminou. Seus dados estão salvos e seguros.
                Assine agora para continuar usando o sistema com todas as funcionalidades.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
