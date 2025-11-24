import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatInTimeZone } from 'date-fns-tz';
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { Lock } from "lucide-react";

interface ProducaoFormProps {
  onSuccess: () => void;
}

export function ProducaoForm({ onSuccess }: ProducaoFormProps) {
  const { toast } = useToast();
  const { hasAccess } = useSubscriptionAccess();
  const [isLoading, setIsLoading] = useState(false);
  const [quantidade, setQuantidade] = useState("");
  const [metragemPalete, setMetragemPalete] = useState("");
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
        .from("paletes_producao")
        .insert({
          quantidade: parseInt(quantidade),
          metragem_palete: parseFloat(metragemPalete),
          data: data,
          user_id: userData.user.id,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produção de paletes registrada.",
      });

      setQuantidade("");
      setMetragemPalete("");
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
      <h2 className="text-xl font-bold mb-4">Registrar Produção de Paletes</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade de Paletes</Label>
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
          <Label htmlFor="metragemPalete">Metragem por Palete (m³)</Label>
          <Input
            id="metragemPalete"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={metragemPalete}
            onChange={(e) => setMetragemPalete(e.target.value)}
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
        <Button type="submit" className="w-full" disabled={isLoading || !hasAccess}>
          {!hasAccess ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Assinatura Necessária
            </>
          ) : isLoading ? (
            "Salvando..."
          ) : (
            "Registrar Produção"
          )}
        </Button>
      </form>
    </Card>
  );
}