import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Producao {
  id: string;
  quantidade: number;
  metragem_palete: number;
  data: string;
}

export function RecentProduction() {
  const [producoes, setProducoes] = useState<Producao[]>([]);

  useEffect(() => {
    const fetchProducoes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("paletes_producao")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false })
        .limit(5);

      if (data) setProducoes(data);
    };

    fetchProducoes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produção Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {producoes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma produção registrada ainda</p>
          ) : (
            producoes.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{prod.quantidade} Paletes</p>
                  <p className="text-xs text-muted-foreground">
                    {Number(prod.metragem_palete).toFixed(2)} m³ por palete
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(prod.data), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-sm font-semibold text-blue-600">
                  {(prod.quantidade * Number(prod.metragem_palete)).toFixed(2)} m³
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
