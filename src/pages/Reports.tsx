import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Filter, FileSpreadsheet, FileText } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { format } from 'date-fns';

export default function Reports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedTrainingTypes, setSelectedTrainingTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [includeStatistics, setIncludeStatistics] = useState(true);
  const [includeFeedback, setIncludeFeedback] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(false);

  // Mock data
  const departments = ["Production", "RH", "Marketing", "Comptabilité"];
  const trainingTypes = ["Sécurité", "Informatique", "Management"];
  const statuses = ["Planifiée", "Terminée", "Annulée"];
  const mockReportData = [
    { training: "Sécurité au travail", department: "Production", participants: 25, date: "2024-05-15", status: "Terminée", rating: 4.5 },
    { training: "Excel avancé", department: "Comptabilité", participants: 15, date: "2024-05-20", status: "Terminée", rating: 4.8 },
    { training: "Gestion de projet", department: "Marketing", participants: 20, date: "2024-05-25", status: "Planifiée", rating: 0 },
    { training: "Soudure niveau 1", department: "Production", participants: 10, date: "2024-05-30", status: "Terminée", rating: 4.2 },
    { training: "Communication interpersonnelle", department: "RH", participants: 12, date: "2024-06-05", status: "Planifiée", rating: 0 },
    { training: "Sécurité incendie", department: "Production", participants: 25, date: "2024-05-15", status: "Terminée", rating: 4.5 },
    { training: "Word pour débutants", department: "Comptabilité", participants: 15, date: "2024-05-20", status: "Terminée", rating: 4.8 },
    { training: "Marketing digital", department: "Marketing", participants: 20, date: "2024-05-25", status: "Planifiée", rating: 0 },
    { training: "Lecture de plans", department: "Production", participants: 10, date: "2024-05-30", status: "Terminée", rating: 4.2 },
    { training: "Gestion des conflits", department: "RH", participants: 12, date: "2024-06-05", status: "Planifiée", rating: 0 }
  ];

  const handleExportClick = (format: 'excel' | 'pdf') => {
    const filename = `rapport_${formatDate(dateRange.from)}_${formatDate(dateRange.to)}.${format}`;
    alert(`Export du rapport au format ${format.toUpperCase()} - Nom du fichier: ${filename}`);
  };

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (checked: boolean | "indeterminate") => {
      if (typeof checked === 'boolean') {
        setter(checked);
      }
    };
  };

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'dd-MM-yyyy') : 'N/A';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rapports & Exports</h1>
                <p className="text-gray-600">Génération de rapports personnalisés</p>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Filtres et configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres et configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Période */}
                <div>
                  <Label className="text-base font-medium">Période</Label>
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={setDateRange}
                    className="mt-2"
                  />
                </div>

                {/* Filtres par type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Départements */}
                  <div>
                    <Label className="text-base font-medium">Départements</Label>
                    <div className="mt-2 space-y-2">
                      {departments.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dept-${dept}`}
                            checked={selectedDepartments.includes(dept)}
                            onCheckedChange={handleCheckboxChange((checked) => {
                              if (checked) {
                                setSelectedDepartments([...selectedDepartments, dept]);
                              } else {
                                setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                              }
                            })}
                          />
                          <Label htmlFor={`dept-${dept}`} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Types de formation */}
                  <div>
                    <Label className="text-base font-medium">Types de formation</Label>
                    <div className="mt-2 space-y-2">
                      {trainingTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTrainingTypes.includes(type)}
                            onCheckedChange={handleCheckboxChange((checked) => {
                              if (checked) {
                                setSelectedTrainingTypes([...selectedTrainingTypes, type]);
                              } else {
                                setSelectedTrainingTypes(selectedTrainingTypes.filter(t => t !== type));
                              }
                            })}
                          />
                          <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statuts */}
                  <div>
                    <Label className="text-base font-medium">Statuts</Label>
                    <div className="mt-2 space-y-2">
                      {statuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={handleCheckboxChange((checked) => {
                              if (checked) {
                                setSelectedStatuses([...selectedStatuses, status]);
                              } else {
                                setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                              }
                            })}
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Options d'export */}
                <div>
                  <Label className="text-base font-medium">Options d'export</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-stats"
                        checked={includeStatistics}
                        onCheckedChange={handleCheckboxChange(setIncludeStatistics)}
                      />
                      <Label htmlFor="include-stats" className="text-sm">Inclure les statistiques</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-feedback"
                        checked={includeFeedback}
                        onCheckedChange={handleCheckboxChange(setIncludeFeedback)}
                      />
                      <Label htmlFor="include-feedback" className="text-sm">Inclure les évaluations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-charts"
                        checked={includeCharts}
                        onCheckedChange={handleCheckboxChange(setIncludeCharts)}
                      />
                      <Label htmlFor="include-charts" className="text-sm">Inclure les graphiques</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions d'export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Générer le rapport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleExportClick('excel')}
                    className="flex items-center gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Exporter en Excel
                  </Button>
                  <Button
                    onClick={() => handleExportClick('pdf')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Exporter en PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu des données */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des données</CardTitle>
                <CardDescription>
                  Prévisualisation du rapport selon les filtres sélectionnés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formation</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Note moyenne</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReportData.slice(0, 5).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.training}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.participants}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'Terminée' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.rating}/5</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {mockReportData.length > 5 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    ... et {mockReportData.length - 5} autres lignes
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
