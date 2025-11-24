import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type PaleteProducao = Tables<"paletes_producao">;

interface ProducaoListProps {
  refresh: number;
}

export function ProducaoList({ refresh }: ProducaoListProps) {
  const { toast } = useToast();
  const [producoes, setProducoes] = useState<PaleteProducao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducoes();
  }, [refresh]);

  const loadProducoes = async () => {
    try {
      const { data, error } = await supabase
        .from("paletes_producao")
        .select("*")
        .order("data", { ascending: false });

      if (error) throw error;
      setProducoes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar produções",
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
        .from("paletes_producao")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produção excluída.",
      });
      loadProducoes();
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

  if (producoes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma produção registrada ainda.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Produções Registradas</h2>
      {producoes.map((producao) => (
        <Card key={producao.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold">{producao.quantidade} Paletes</div>
              <div className="text-sm text-muted-foreground">
                {producao.metragem_palete} m³/palete
              </div>
              <div className="text-xs text-muted-foreground">
                Registrado em: {new Date(producao.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(producao.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}