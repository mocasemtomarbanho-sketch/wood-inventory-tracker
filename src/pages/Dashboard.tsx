import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LogOut, Download, Filter, X, TreePine } from "lucide-react";

interface Entry {
  id: number;
  date: string;
  meters_in: number;
  wood_type: string;
  truck_plate: string;
  supplier: string;
  pallets_count: number;
  pallet_meters: number;
  sold: boolean;
  sold_to: string;
}

interface User {
  email: string;
  name?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Check auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // Entries with seed data
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 1,
      date: "2025-11-20",
      meters_in: 12.5,
      wood_type: "Pinus",
      truck_plate: "ABC-1234",
      supplier: "Madeiras Silva",
      pallets_count: 2,
      pallet_meters: 6.25,
      sold: true,
      sold_to: "Fulano"
    },
    {
      id: 2,
      date: "2025-11-21",
      meters_in: 20,
      wood_type: "Eucalipto",
      truck_plate: "XYZ-9876",
      supplier: "Florestal Ltda",
      pallets_count: 3,
      pallet_meters: 6.67,
      sold: false,
      sold_to: ""
    }
  ]);

  // Form state
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    meters_in: "",
    wood_type: "",
    truck_plate: "",
    supplier: "",
    pallets_count: "",
    pallet_meters: "",
    sold: false,
    sold_to: ""
  });

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Sessão encerrada");
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSoldChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, sold: checked }));
  };

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Entry = {
      id: Date.now(),
      date: form.date,
      meters_in: Number(form.meters_in) || 0,
      wood_type: form.wood_type,
      truck_plate: form.truck_plate,
      supplier: form.supplier,
      pallets_count: Number(form.pallets_count) || 0,
      pallet_meters: Number(form.pallet_meters) || 0,
      sold: form.sold,
      sold_to: form.sold_to
    };
    setEntries((prev) => [newEntry, ...prev]);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      meters_in: "",
      wood_type: "",
      truck_plate: "",
      supplier: "",
      pallets_count: "",
      pallet_meters: "",
      sold: false,
      sold_to: ""
    });
    toast.success("Entrada registrada com sucesso!");
  };

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((r) => r.id !== id));
    toast.success("Entrada excluída");
  };

  // Filtered entries by date range
  const filtered = entries.filter((r) => {
    if (!fromDate && !toDate) return true;
    const d = new Date(r.date);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;
    return true;
  });

  // Summary calculations
  const summary = filtered.reduce(
    (acc, cur) => {
      acc.total_meters += cur.meters_in;
      acc.total_pallets += cur.pallets_count;
      acc.total_pallet_meters += cur.pallet_meters;
      if (cur.sold) acc.sold_count += 1;
      return acc;
    },
    { total_meters: 0, total_pallets: 0, total_pallet_meters: 0, sold_count: 0 }
  );

  // Export to PDF
  const exportPdf = async () => {
    const element = document.getElementById("report-area");
    if (!element) return;

    toast.info("Gerando PDF...");
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape" });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`relatorio-madeiras-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF gerado com sucesso!");
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    toast.info("Filtros limpos");
  };

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card-custom">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-wood rounded-lg">
              <TreePine className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Controle de Madeiras</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden sm:block">
              {user.name || user.email}
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Form */}
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="text-lg">Registrar Entrada/Venda</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addEntry} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input type="date" id="date" name="date" value={form.date} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meters_in">Metros</Label>
                  <Input id="meters_in" name="meters_in" placeholder="12.5" value={form.meters_in} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wood_type">Tipo de Madeira</Label>
                  <Input id="wood_type" name="wood_type" placeholder="Pinus, Eucalipto..." value={form.wood_type} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="truck_plate">Placa do Caminhão</Label>
                  <Input id="truck_plate" name="truck_plate" placeholder="ABC-1234" value={form.truck_plate} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input id="supplier" name="supplier" placeholder="Nome do fornecedor" value={form.supplier} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pallets_count">Quantidade de Paletes</Label>
                  <Input id="pallets_count" name="pallets_count" placeholder="2" value={form.pallets_count} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pallet_meters">Metro do Palete</Label>
                  <Input id="pallet_meters" name="pallet_meters" placeholder="6.25" value={form.pallet_meters} onChange={handleChange} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sold" checked={form.sold} onCheckedChange={handleSoldChange} />
                  <Label htmlFor="sold" className="cursor-pointer">Vendido?</Label>
                </div>
                {form.sold && (
                  <div className="space-y-2">
                    <Label htmlFor="sold_to">Vendido Para</Label>
                    <Input id="sold_to" name="sold_to" placeholder="Nome do comprador" value={form.sold_to} onChange={handleChange} />
                  </div>
                )}
                <Button type="submit" className="w-full">Adicionar Entrada</Button>
              </form>
            </CardContent>
          </Card>

          {/* Filters & Summary */}
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="text-lg">Filtros e Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Período</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="De" />
                  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="Até" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-sm text-muted-foreground">Estatísticas do Período</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm">Total de Metros</span>
                    <span className="font-bold text-primary">{summary.total_meters.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm">Total de Paletes</span>
                    <span className="font-bold text-secondary">{summary.total_pallets}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm">Metros de Palete</span>
                    <span className="font-bold text-accent">{summary.total_pallet_meters.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm">Vendas Realizadas</span>
                    <span className="font-bold">{summary.sold_count}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={exportPdf} variant="secondary" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={clearFilters} variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card className="lg:col-span-3 shadow-elegant" id="report-area">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Registro de Entradas ({filtered.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left font-semibold">Data</th>
                      <th className="p-3 text-left font-semibold">Metros</th>
                      <th className="p-3 text-left font-semibold">Madeira</th>
                      <th className="p-3 text-left font-semibold">Placa</th>
                      <th className="p-3 text-left font-semibold">Fornecedor</th>
                      <th className="p-3 text-left font-semibold">Paletes</th>
                      <th className="p-3 text-left font-semibold">M/Palete</th>
                      <th className="p-3 text-left font-semibold">Vendido</th>
                      <th className="p-3 text-left font-semibold">Para</th>
                      <th className="p-3 text-left font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry) => (
                      <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                        <td className="p-3 font-medium">{entry.meters_in}</td>
                        <td className="p-3">{entry.wood_type}</td>
                        <td className="p-3">{entry.truck_plate}</td>
                        <td className="p-3">{entry.supplier}</td>
                        <td className="p-3">{entry.pallets_count}</td>
                        <td className="p-3">{entry.pallet_meters.toFixed(2)}</td>
                        <td className="p-3">
                          {entry.sold ? (
                            <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-medium">Sim</span>
                          ) : (
                            <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">Não</span>
                          )}
                        </td>
                        <td className="p-3">{entry.sold_to || "-"}</td>
                        <td className="p-3">
                          <Button variant="destructive" size="sm" onClick={() => deleteEntry(entry.id)}>
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="text-center text-sm text-muted-foreground py-6">
        Plataforma de Controle de Madeiras
      </footer>
    </div>
  );
};

export default Dashboard;
