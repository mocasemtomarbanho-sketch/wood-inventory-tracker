import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatInTimeZone } from 'date-fns-tz';

interface EstoqueFormProps {
  onSuccess: () => void;
}

export function EstoqueForm({ onSuccess }: EstoqueFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tipoMadeira, setTipoMadeira] = useState("");
  const [quantidadeMetros, setQuantidadeMetros] = useState("");
  const [data, setData] = useState(formatInTimeZone(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("madeira_entradas")
        .insert({
          tipo_madeira: tipoMadeira,
          quantidade_metros: parseFloat(quantidadeMetros),
          data: data,
          user_id: userData.user.id,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Entrada de madeira registrada.",
      });

      setTipoMadeira("");
      setQuantidadeMetros("");
      setData(formatInTimeZone(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd'));
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Registrar Entrada de Madeira</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tipoMadeira">Tipo de Madeira</Label>
          <Input
            id="tipoMadeira"
            placeholder="Ex: Pinus, Eucalipto..."
            value={tipoMadeira}
            onChange={(e) => setTipoMadeira(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantidadeMetros">Quantidade (m³)</Label>
          <Input
            id="quantidadeMetros"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={quantidadeMetros}
            onChange={(e) => setQuantidadeMetros(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Registrar Entrada"}
        </Button>
      </form>
    </Card>
  );
}