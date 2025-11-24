import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VendasFormProps {
  onSuccess: () => void;
}

export function VendasForm({ onSuccess }: VendasFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

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
        .from("vendas")
        .insert({
          cliente: cliente,
          produto: produto,
          quantidade: parseInt(quantidade),
          valor_total: parseFloat(valorTotal),
          data: data,
          user_id: userData.user.id,
        });

      if (error) throw error;

      // Tocar som de caixa registradora
      try {
        const audio = new Audio('/sounds/cash-register.mp3');
        audio.volume = 0.5;
        await audio.play();
      } catch (audioError) {
        console.error('Erro ao tocar som:', audioError);
      }

      toast({
        title: "Sucesso!",
        description: "Venda registrada.",
      });

      setCliente("");
      setProduto("");
      setQuantidade("");
      setValorTotal("");
      setData(new Date().toISOString().split('T')[0]);
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
      <h2 className="text-xl font-bold mb-4">Registrar Venda</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Input
            id="cliente"
            placeholder="Nome do cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="produto">Produto</Label>
          <Input
            id="produto"
            placeholder="Ex: Palete 120x100"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            placeholder="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="valorTotal">Valor Total (R$)</Label>
          <Input
            id="valorTotal"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
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
          {isLoading ? "Salvando..." : "Registrar Venda"}
        </Button>
      </form>
    </Card>
  );
}