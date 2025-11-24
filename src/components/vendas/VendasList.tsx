import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Venda = Tables<"vendas">;

interface VendasListProps {
  refresh: number;
}

export function VendasList({ refresh }: VendasListProps) {
  const { toast } = useToast();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVendas();
  }, [refresh]);

  const loadVendas = async () => {
    try {
      const { data, error } = await supabase
        .from("vendas")
        .select("*")
        .order("data", { ascending: false });

      if (error) throw error;
      setVendas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vendas",
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
        .from("vendas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Venda excluída.",
      });
      loadVendas();
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

  if (vendas.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma venda registrada ainda.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Vendas Registradas</h2>
      {vendas.map((venda) => (
        <Card key={venda.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold">{venda.cliente}</div>
              <div className="text-sm text-muted-foreground">
                {venda.produto} • {venda.quantidade} unidades • R$ {venda.valor_total.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Registrado em: {new Date(venda.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(venda.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}