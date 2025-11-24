import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Caminhao {
  id: string;
  placa: string;
  motorista: string;
  tipo_carga: string;
  data_entrada: string;
}

export function RecentTrucks() {
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([]);

  useEffect(() => {
    const fetchCaminhoes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("caminhoes_entradas")
        .select("*")
        .eq("user_id", user.id)
        .order("data_entrada", { ascending: false })
        .limit(5);

      if (data) setCaminhoes(data);
    };

    fetchCaminhoes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entradas de Caminhões Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {caminhoes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma entrada registrada ainda</p>
          ) : (
            caminhoes.map((caminhao) => (
              <div key={caminhao.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{caminhao.placa}</p>
                  <p className="text-xs text-muted-foreground">{caminhao.motorista}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(caminhao.data_entrada), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-sm font-semibold text-purple-600">
                  {caminhao.tipo_carga}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
