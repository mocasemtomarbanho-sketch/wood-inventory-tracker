import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart3, Shield, Truck, FileText, Package, TrendingUp, Clock, CheckCircle2, Menu, X, Check } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">PalletePro</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('funcionalidades')} className="text-sm font-medium hover:text-primary transition-colors">
                Funcionalidades
              </button>
              <button onClick={() => scrollToSection('sobre')} className="text-sm font-medium hover:text-primary transition-colors">
                Sobre
              </button>
              <button onClick={() => scrollToSection('planos')} className="text-sm font-medium hover:text-primary transition-colors">
                Planos
              </button>
              <button onClick={() => scrollToSection('recursos')} className="text-sm font-medium hover:text-primary transition-colors">
                Recursos
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-sm font-medium hover:text-primary transition-colors">
                Contato
              </button>
              <div className="flex gap-3 ml-4">
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Entrar
                </Button>
                <Button onClick={() => navigate("/auth")}>
                  Começar Grátis
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
              <button 
                onClick={() => scrollToSection('funcionalidades')} 
                className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => scrollToSection('sobre')} 
                className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('planos')} 
                className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Planos
              </button>
              <button 
                onClick={() => scrollToSection('recursos')} 
                className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Recursos
              </button>
              <button 
                onClick={() => scrollToSection('contato')} 
                className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Contato
              </button>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost" onClick={() => navigate("/auth")} className="w-full">
                  Entrar
                </Button>
                <Button onClick={() => navigate("/auth")} className="w-full">
                  Começar Grátis
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Sistema Completo de Gestão
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Venda e Controle de <span className="text-primary">Paletes</span> Simplificado
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plataforma profissional para gerenciar vendas, estoque, fornecedores e entregas de paletes
            com relatórios detalhados e controle total do seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Começar Grátis Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('recursos')} className="text-lg px-8 py-6">
              Conhecer Recursos
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t">
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Controle Total</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Acesso Online</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Entradas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Paletes */}
      <section id="sobre" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Especialistas em Gestão de Paletes
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Nossa plataforma foi desenvolvida especificamente para empresas que trabalham com 
                venda e distribuição de paletes. Controlamos desde a entrada do material, passando 
                pela produção, até a venda final.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Controle de Estoque</h4>
                    <p className="text-sm text-muted-foreground">Saiba exatamente quantos paletes você tem disponível em tempo real</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Gestão de Vendas</h4>
                    <p className="text-sm text-muted-foreground">Registre todas as vendas com informações completas do comprador</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Rastreamento de Fornecedores</h4>
                    <p className="text-sm text-muted-foreground">Mantenha histórico completo de fornecedores e entregas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <Package className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">Paletes</div>
                <div className="text-sm text-muted-foreground">Gestão Completa</div>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">Vendas</div>
                <div className="text-sm text-muted-foreground">Controle Total</div>
              </Card>
              <Card className="p-6 text-center">
                <Truck className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">Entregas</div>
                <div className="text-sm text-muted-foreground">Rastreamento</div>
              </Card>
              <Card className="p-6 text-center">
                <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">Relatórios</div>
                <div className="text-sm text-muted-foreground">Exportação PDF</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-foreground">
            Funcionalidades Completas
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seu negócio de paletes em uma única plataforma
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all hover-scale">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Controle de Entradas</h4>
            <p className="text-muted-foreground">
              Registre cada entrada de madeira com detalhes completos: metros, tipo, fornecedor e placa do caminhão.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover-scale">
            <Package className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Gestão de Paletes</h4>
            <p className="text-muted-foreground">
              Controle quantidade de paletes produzidos, metros utilizados e estoque disponível.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover-scale">
            <TrendingUp className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Registro de Vendas</h4>
            <p className="text-muted-foreground">
              Marque paletes como vendidos e mantenha registro completo dos compradores.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover-scale">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Relatórios PDF</h4>
            <p className="text-muted-foreground">
              Exporte relatórios profissionais com filtros por período e estatísticas detalhadas.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover-scale">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Dados Seguros</h4>
            <p className="text-muted-foreground">
              Seus dados protegidos com autenticação segura e backup automático na nuvem.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover-scale">
            <Clock className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Filtros por Data</h4>
            <p className="text-muted-foreground">
              Analise períodos específicos com filtros flexíveis e visualize estatísticas em tempo real.
            </p>
          </Card>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Comece Grátis por 7 Dias
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Teste todas as funcionalidades sem compromisso. Depois escolha o plano ideal para seu negócio.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Plano Trial - 7 Dias Grátis */}
          <Card className="p-8 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                🎉 Comece Agora
              </span>
            </div>
            <div className="text-center mb-6 mt-4">
              <h4 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                7 Dias Grátis
              </h4>
              <div className="text-5xl font-bold mb-3 text-foreground">R$ 0</div>
              <p className="text-muted-foreground font-medium">Teste completo sem cartão de crédito</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <span className="font-medium">7 dias de acesso total</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <span className="font-medium">Todas as funcionalidades liberadas</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <span className="font-medium">Gestão completa de estoque</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <span className="font-medium">Controle de produção e vendas</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <span className="font-medium">Relatórios e dashboards</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <span className="font-medium">Seus dados salvos e seguros</span>
              </li>
            </ul>
            <Button 
              size="lg"
              className="w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/auth")}
            >
              Começar Teste Grátis
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Não é necessário cartão de crédito
            </p>
          </Card>

          {/* Plano Mensal */}
          <Card className="p-8 border-2 relative">
            <div className="text-center mb-6">
              <h4 className="text-3xl font-bold mb-3 text-foreground">Plano Mensal</h4>
              <div className="text-5xl font-bold mb-3 text-primary">
                R$ 100<span className="text-xl text-muted-foreground font-normal">/mês</span>
              </div>
              <p className="text-muted-foreground font-medium">Acesso ilimitado após o período de teste</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Acesso ilimitado permanente</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Todas as funcionalidades</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Registros ilimitados</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Relatórios em PDF profissionais</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Suporte prioritário via WhatsApp</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Atualizações e melhorias gratuitas</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Backup automático diário</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Segurança avançada</span>
              </li>
            </ul>
            <Button 
              variant="outline"
              size="lg"
              className="w-full text-lg font-semibold border-2"
              onClick={() => navigate("/planos")}
            >
              Ver Detalhes
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Cancele quando quiser, sem multa
            </p>
          </Card>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Recursos Principais
            </h3>
            <p className="text-lg text-muted-foreground">
              Descubra tudo o que você pode fazer
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Rastreamento de Entregas</h4>
              <p className="text-muted-foreground">
                Acompanhe cada entrega com placa do caminhão e fornecedor
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Estatísticas em Tempo Real</h4>
              <p className="text-muted-foreground">
                Visualize total de metros, paletes e vendas instantaneamente
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Exportação Profissional</h4>
              <p className="text-muted-foreground">
                Gere PDFs de alta qualidade para apresentar aos clientes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Pronto para transformar seu negócio de paletes?
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Comece grátis hoje mesmo. Sem cartão de crédito necessário. 
            Configure em minutos e comece a gerenciar suas vendas imediatamente.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
            Começar Agora Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">PalletePro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma profissional para gestão completa de venda e controle de paletes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('funcionalidades')} className="hover:text-primary">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection('recursos')} className="hover:text-primary">Recursos</button></li>
                <li><button onClick={() => navigate("/auth")} className="hover:text-primary">Começar Grátis</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('sobre')} className="hover:text-primary">Sobre</button></li>
                <li><button className="hover:text-primary">Contato</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-primary">Ajuda</button></li>
                <li><button className="hover:text-primary">FAQ</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PalletePro. Todos os direitos reservados. Plataforma profissional de gestão de paletes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
