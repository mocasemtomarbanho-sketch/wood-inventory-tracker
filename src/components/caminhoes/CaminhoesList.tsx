import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type CaminhaoEntrada = Tables<"caminhoes_entradas">;

interface CaminhoesListProps {
  refresh: number;
}

export function CaminhoesList({ refresh }: CaminhoesListProps) {
  const { toast } = useToast();
  const [entradas, setEntradas] = useState<CaminhaoEntrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntradas();
  }, [refresh]);

  const loadEntradas = async () => {
    try {
      const { data, error } = await supabase
        .from("caminhoes_entradas")
        .select("*")
        .order("data_entrada", { ascending: false });

      if (error) throw error;
      setEntradas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar entradas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("caminhoes_entradas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Entrada excluída.",
      });
      loadEntradas();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  if (entradas.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma entrada registrada ainda.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Entradas de Caminhões</h2>
      {entradas.map((entrada) => (
        <Card key={entrada.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold">{entrada.placa}</div>
              <div className="text-sm text-muted-foreground">
                Motorista: {entrada.motorista}
              </div>
              <div className="text-sm text-muted-foreground">
                Carga: {entrada.tipo_carga}
              </div>
              <div className="text-xs text-muted-foreground">
                Registrado em: {new Date(entrada.created_at).toLocaleDateString('pt-BR')} às {new Date(entrada.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(entrada.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}