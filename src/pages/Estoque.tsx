import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EstoqueForm } from "@/components/estoque/EstoqueForm";
import { EstoqueList } from "@/components/estoque/EstoqueList";

export default function Estoque() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

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
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Estoque</h1>
                <p className="text-muted-foreground">Gestão de estoque de materiais</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <EstoqueForm onSuccess={() => setRefresh(prev => prev + 1)} />
                <EstoqueList refresh={refresh} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
