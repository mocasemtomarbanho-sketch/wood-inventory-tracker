import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { RecentProduction } from "@/components/dashboard/RecentProduction";
import { RecentStock } from "@/components/dashboard/RecentStock";
import { RecentTrucks } from "@/components/dashboard/RecentTrucks";

interface User {
  email: string;
  name?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser({ email: session.user.email || '', name: session.user.user_metadata?.name });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          navigate("/auth");
        } else {
          setUser({ email: session.user.email || '', name: session.user.user_metadata?.name });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Olá, {user.name || user.email}! 👋</h1>
              <p className="text-muted-foreground">Visão geral do seu sistema de gestão</p>
            </div>

            {/* Cards de Estatísticas */}
            <DashboardStats />

            {/* Gráficos e Dados Recentes */}
            <div className="grid gap-6 md:grid-cols-2">
              <RecentSales />
              <RecentProduction />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <RecentStock />
              <RecentTrucks />
            </div>
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
  );
};

export default Dashboard;
