import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Caminhoes from "./pages/Caminhoes";
import Producao from "./pages/Producao";
import Vendas from "./pages/Vendas";
import Notificacoes from "./pages/Notificacoes";
import Relatorios from "./pages/Relatorios";
import Administracao from "./pages/Administracao";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/caminhoes" element={<Caminhoes />} />
          <Route path="/producao" element={<Producao />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/administracao" element={<Administracao />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
