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

interface CaminhoesFormProps {
  onSuccess: () => void;
}

export function CaminhoesForm({ onSuccess }: CaminhoesFormProps) {
  const { toast } = useToast();
  const { hasAccess, redirectToPlans } = useSubscriptionAccess();
  const [isLoading, setIsLoading] = useState(false);
  const [placa, setPlaca] = useState("");
  const [motorista, setMotorista] = useState("");
  const [tipoCarga, setTipoCarga] = useState("");

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
        .from("caminhoes_entradas")
        .insert({
          placa: placa.toUpperCase(),
          motorista: motorista,
          tipo_carga: tipoCarga,
          data_entrada: formatInTimeZone(new Date(), 'America/Sao_Paulo', "yyyy-MM-dd'T'HH:mm:ssXXX"),
          user_id: userData.user.id,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Entrada de caminhão registrada.",
      });

      setPlaca("");
      setMotorista("");
      setTipoCarga("");
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
      <h2 className="text-xl font-bold mb-4">Registrar Entrada de Caminhão</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="placa">Placa</Label>
          <Input
            id="placa"
            placeholder="ABC-1234"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="motorista">Motorista</Label>
          <Input
            id="motorista"
            placeholder="Nome do motorista"
            value={motorista}
            onChange={(e) => setMotorista(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipoCarga">Tipo de Carga</Label>
          <Input
            id="tipoCarga"
            placeholder="Ex: Madeira, Paletes..."
            value={tipoCarga}
            onChange={(e) => setTipoCarga(e.target.value)}
            required
          />
        </div>
        {!hasAccess ? (
          <Button 
            type="button" 
            className="w-full" 
            onClick={redirectToPlans}
            variant="default"
          >
            <Lock className="mr-2 h-4 w-4" />
            Renovar Plano para Continuar
          </Button>
        ) : (
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Registrar Entrada"}
          </Button>
        )}
      </form>
    </Card>
  );
}