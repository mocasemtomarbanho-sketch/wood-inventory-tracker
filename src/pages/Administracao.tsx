import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Settings, User, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Administracao() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
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
                <h1 className="text-3xl font-bold">Administração</h1>
                <p className="text-muted-foreground">Configurações e informações do sistema</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Informações do Usuário</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">ID</Label>
                      <p className="font-mono text-sm">{user?.id}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Sistema</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Versão</Label>
                      <p className="font-medium">1.0.0</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <p className="font-medium text-green-600">Operacional</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Configurações</h2>
                </div>
                <p className="text-muted-foreground">
                  Configurações avançadas do sistema de gestão da serraria.
                </p>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
