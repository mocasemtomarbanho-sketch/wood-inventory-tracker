import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";

export default function Administracao() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth");
    } else {
      setUser(JSON.parse(storedUser));
    }
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

          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold">Administração</h1>
            <p className="text-muted-foreground">Configurações e administração do sistema</p>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
