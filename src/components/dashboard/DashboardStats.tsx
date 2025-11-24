import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package2, TrendingUp, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalVendas: 0,
    totalProducao: 0,
    totalEstoque: 0,
    totalCaminhoes: 0,
    valorVendas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [vendas, producao, estoque, caminhoes] = await Promise.all([
        supabase.from("vendas").select("quantidade, valor_total").eq("user_id", user.id),
        supabase.from("paletes_producao").select("quantidade").eq("user_id", user.id),
        supabase.from("madeira_entradas").select("quantidade_metros").eq("user_id", user.id),
        supabase.from("caminhoes_entradas").select("id").eq("user_id", user.id),
      ]);

      const totalVendas = vendas.data?.reduce((acc, v) => acc + (v.quantidade || 0), 0) || 0;
      const valorVendas = vendas.data?.reduce((acc, v) => acc + (Number(v.valor_total) || 0), 0) || 0;
      const totalProducao = producao.data?.reduce((acc, p) => acc + (p.quantidade || 0), 0) || 0;
      const totalEstoque = estoque.data?.reduce((acc, e) => acc + (Number(e.quantidade_metros) || 0), 0) || 0;
      const totalCaminhoes = caminhoes.data?.length || 0;

      setStats({
        totalVendas,
        totalProducao,
        totalEstoque,
        totalCaminhoes,
        valorVendas,
      });
    };

    fetchStats();

    // Realtime updates
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendas' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'paletes_producao' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'madeira_entradas' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'caminhoes_entradas' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVendas}</div>
          <p className="text-xs text-muted-foreground">
            R$ {stats.valorVendas.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produção Total</CardTitle>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducao}</div>
          <p className="text-xs text-muted-foreground">Paletes produzidos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estoque de Madeira</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEstoque.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">m³ em estoque</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entradas de Caminhões</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCaminhoes}</div>
          <p className="text-xs text-muted-foreground">Registros totais</p>
        </CardContent>
      </Card>
    </div>
  );
}
