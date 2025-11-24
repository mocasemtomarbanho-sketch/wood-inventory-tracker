import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Factory, 
  ShoppingCart, 
  Bell, 
  FileText, 
  Settings,
  LogOut,
  TreePine,
  CreditCard
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Estoque", url: "/estoque", icon: Package },
  { title: "Caminhões", url: "/caminhoes", icon: Truck },
  { title: "Produção", url: "/producao", icon: Factory },
  { title: "Vendas", url: "/vendas", icon: ShoppingCart },
  { title: "Notificações", url: "/notificacoes", icon: Bell },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Administração", url: "/administracao", icon: Settings },
  { title: "Planos", url: "/planos", icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <TreePine className="h-6 w-6 text-primary" />
          {state === "expanded" && (
            <span className="font-bold text-lg">Gestão Serraria</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className="hover:bg-muted/50 transition-colors"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <item.icon className="h-4 w-4" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {state === "expanded" && <span>Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
