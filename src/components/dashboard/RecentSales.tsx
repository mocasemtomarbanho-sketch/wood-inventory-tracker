import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Venda {
  id: string;
  cliente: string;
  produto: string;
  quantidade: number;
  valor_total: number;
  data: string;
}

export function RecentSales() {
  const [vendas, setVendas] = useState<Venda[]>([]);

  useEffect(() => {
    const fetchVendas = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("vendas")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false })
        .limit(5);

      if (data) setVendas(data);
    };

    fetchVendas();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma venda registrada ainda</p>
          ) : (
            vendas.map((venda) => (
              <div key={venda.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{venda.cliente}</p>
                  <p className="text-xs text-muted-foreground">
                    {venda.produto} - {venda.quantidade} un.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(venda.data), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  R$ {Number(venda.valor_total).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
