import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Download, TrendingUp, Package, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Tables } from "@/integrations/supabase/types";

type Venda = Tables<"vendas">;
type Producao = Tables<"paletes_producao">;

export default function Relatorios() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadData();
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

  const loadData = async () => {
    try {
      const [vendasData, producoesData] = await Promise.all([
        supabase.from("vendas").select("*").order("data", { ascending: false }),
        supabase.from("paletes_producao").select("*").order("data", { ascending: false })
      ]);

      if (vendasData.error) throw vendasData.error;
      if (producoesData.error) throw producoesData.error;

      setVendas(vendasData.data || []);
      setProducoes(producoesData.data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Relatório de Vendas", 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    const tableData = vendas.map(venda => [
      new Date(venda.data).toLocaleDateString('pt-BR'),
      venda.cliente,
      venda.produto,
      venda.quantidade.toString(),
      `R$ ${venda.valor_total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Data', 'Cliente', 'Produto', 'Quantidade', 'Valor Total']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    const totalVendas = vendas.reduce((sum, v) => sum + Number(v.valor_total), 0);
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    
    doc.setFontSize(12);
    doc.text(`Total de Vendas: R$ ${totalVendas.toFixed(2)}`, 14, finalY + 10);

    doc.save('relatorio-vendas.pdf');
    
    toast({
      title: "PDF gerado!",
      description: "O relatório foi baixado com sucesso.",
    });
  };

  if (!user) return null;

  const totalVendas = vendas.reduce((sum, v) => sum + Number(v.valor_total), 0);
  const totalProducao = producoes.reduce((sum, p) => sum + Number(p.quantidade), 0);

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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Relatórios</h1>
                  <p className="text-muted-foreground">Análises e visão geral do sistema</p>
                </div>
                <Button onClick={exportarPDF} className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando...</div>
              ) : (
                <>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total de Vendas</p>
                          <p className="text-2xl font-bold">R$ {totalVendas.toFixed(2)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-primary" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Produção Total</p>
                          <p className="text-2xl font-bold">{totalProducao} paletes</p>
                        </div>
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Vendas Registradas</p>
                          <p className="text-2xl font-bold">{vendas.length}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                    </Card>
                  </div>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Últimas Vendas</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Data</th>
                            <th className="text-left p-2">Cliente</th>
                            <th className="text-left p-2">Produto</th>
                            <th className="text-right p-2">Quantidade</th>
                            <th className="text-right p-2">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendas.slice(0, 10).map((venda) => (
                            <tr key={venda.id} className="border-b">
                              <td className="p-2">{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                              <td className="p-2">{venda.cliente}</td>
                              <td className="p-2">{venda.produto}</td>
                              <td className="text-right p-2">{venda.quantidade}</td>
                              <td className="text-right p-2">R$ {venda.valor_total.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
