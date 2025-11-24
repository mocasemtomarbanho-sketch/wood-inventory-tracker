import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart3, Shield, Truck, FileText } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MadeiraControl</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Entrar
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-foreground">
            Controle Total da Sua <span className="text-primary">Madeira</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Plataforma profissional para gerenciar entradas, vendas e estoque de madeira
            com relatórios detalhados e exportação em PDF.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Criar Conta Grátis
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
          Recursos Profissionais
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Controle Completo</h4>
            <p className="text-muted-foreground">
              Registre entradas, paletes, metros e vendas em um único lugar.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Relatórios PDF</h4>
            <p className="text-muted-foreground">
              Exporte relatórios profissionais com filtros personalizados.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Seguro e Confiável</h4>
            <p className="text-muted-foreground">
              Seus dados protegidos com autenticação e backup automático.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Truck className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Rastreamento</h4>
            <p className="text-muted-foreground">
              Acompanhe fornecedores, placas de caminhão e tipos de madeira.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 border-y py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 text-foreground">
            Pronto para otimizar seu controle de madeira?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Comece grátis hoje mesmo. Sem cartão de crédito necessário.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")}>
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 MadeiraControl. Plataforma profissional de gestão de madeira.</p>
        </div>
      </footer>
    </div>
  );
}
