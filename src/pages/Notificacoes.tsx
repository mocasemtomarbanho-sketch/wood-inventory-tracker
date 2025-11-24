import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, AlertTriangle, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EstoqueItem {
  id: string;
  tipo_madeira: string;
  quantidade_metros: number;
  data: string;
}

export default function Notificacoes() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [estoquesBaixos, setEstoquesBaixos] = useState<EstoqueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadNotificacoes();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadNotificacoes = async () => {
    try {
      const { data, error } = await supabase
        .from("madeira_entradas")
        .select("*")
        .order("data", { ascending: false });

      if (error) throw error;

      // Agrupar por tipo de madeira e somar quantidades
      const estoqueAgrupado = (data || []).reduce((acc: any, item: EstoqueItem) => {
        if (!acc[item.tipo_madeira]) {
          acc[item.tipo_madeira] = {
            tipo_madeira: item.tipo_madeira,
            quantidade_metros: 0,
            id: item.id,
            data: item.data
          };
        }
        acc[item.tipo_madeira].quantidade_metros += Number(item.quantidade_metros);
        return acc;
      }, {});

      // Filtrar estoques com menos de 100 metros
      const baixos = Object.values(estoqueAgrupado).filter(
        (item: any) => item.quantidade_metros < 100
      ) as EstoqueItem[];

      setEstoquesBaixos(baixos);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <SidebarTrigger />
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
          </header>

          <main className="flex-1 p-6 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Notificações</h1>
                <p className="text-muted-foreground">Central de alertas e notificações do sistema</p>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando...</div>
              ) : (
                <div className="space-y-4">
                  {estoquesBaixos.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhum alerta no momento. Estoque em níveis adequados.</p>
                    </Card>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Alertas de Estoque Baixo
                      </h2>
                      {estoquesBaixos.map((item) => (
                        <Alert key={item.id} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Estoque Baixo - {item.tipo_madeira}</AlertTitle>
                          <AlertDescription>
                            Quantidade atual: {item.quantidade_metros.toFixed(2)} metros.
                            Recomendamos reabastecimento urgente.
                          </AlertDescription>
                        </Alert>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
