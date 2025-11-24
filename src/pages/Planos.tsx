import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Loader2, ArrowLeft } from "lucide-react";

export default function Planos() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSubscription(session.user.id);
      }
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadSubscription(session.user.id);
        }
      }
    );

    return () => authListener.unsubscribe();
  }, []);

  const loadSubscription = async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setSubscription(data);
    }
  };

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

  const hasActiveSubscription = subscription?.status === 'active' && 
    subscription?.expires_at && 
    new Date(subscription.expires_at) > new Date();

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
            Escolha Seu Plano
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece gratuitamente ou assine para acesso completo
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Plano Gratuito */}
          <Card className="p-8 border-2">
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold mb-2">Teste Grátis</h4>
              <div className="text-4xl font-bold mb-2">R$ 0</div>
              <p className="text-muted-foreground">Experimente sem compromisso</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Acesso limitado por 7 dias</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Todas as funcionalidades</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Suporte básico</span>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Começar Grátis
            </Button>
          </Card>

          {/* Plano Mensal */}
          <Card className={`p-8 border-2 relative ${hasActiveSubscription ? 'border-green-500' : 'border-primary'}`}>
            {hasActiveSubscription && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Assinatura Ativa
                </span>
              </div>
            )}
            {!hasActiveSubscription && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Recomendado
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
            ) : (
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
                  'Assinar Agora'
                )}
              </Button>
            )}
          </Card>
        </div>

        {hasActiveSubscription && (
          <div className="text-center mt-8">
            <Card className="p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-2">✓ Você está com acesso completo!</h3>
              <p className="text-muted-foreground">
                Aproveite todos os recursos ilimitados da plataforma
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
