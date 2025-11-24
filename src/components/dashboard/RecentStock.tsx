import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Estoque {
  id: string;
  tipo_madeira: string;
  quantidade_metros: number;
  data: string;
}

export function RecentStock() {
  const [estoques, setEstoques] = useState<Estoque[]>([]);

  useEffect(() => {
    const fetchEstoques = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("madeira_entradas")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false })
        .limit(5);

      if (data) setEstoques(data);
    };

    fetchEstoques();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entradas de Estoque Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {estoques.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma entrada registrada ainda</p>
          ) : (
            estoques.map((estoque) => (
              <div key={estoque.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{estoque.tipo_madeira}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(estoque.data), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-sm font-semibold text-amber-600">
                  {Number(estoque.quantidade_metros).toFixed(2)} m³
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
