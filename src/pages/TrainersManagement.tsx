
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Star, Calendar as CalendarIcon, Plus, FileText, Euro, Clock } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  rating: number;
  isExternal: boolean;
  hourlyRate?: number;
  cv: string;
  certifications: string[];
}

interface TrainerAvailability {
  trainerId: number;
  date: string;
  isAvailable: boolean;
  timeSlots: string[];
}

interface Contract {
  id: number;
  trainerId: number;
  trainingName: string;
  startDate: string;
  endDate: string;
  hourlyRate: number;
  totalHours: number;
  status: "draft" | "signed" | "completed" | "cancelled";
}

const TrainersManagement = () => {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: 1,
      firstName: "Dr. Martin",
      lastName: "Leclerc",
      email: "martin.leclerc@external.com",
      phone: "+33123456789",
      specialties: ["Sécurité industrielle", "Prévention des risques"],
      rating: 4.8,
      isExternal: true,
      hourlyRate: 150,
      cv: "15 ans d'expérience en sécurité industrielle...",
      certifications: ["CNAM Sécurité", "IOSH"]
    },
    {
      id: 2,
      firstName: "Sophie",
      lastName: "Durand",
      email: "sophie.durand@company.com",
      phone: "+33987654321",
      specialties: ["Management", "Leadership"],
      rating: 4.6,
      isExternal: false,
      cv: "Manager senior avec 10 ans d'expérience...",
      certifications: ["PMP", "Coaching Certification"]
    },
  ]);

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      trainerId: 1,
      trainingName: "Formation Sécurité Q2",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
      hourlyRate: 150,
      totalHours: 40,
      status: "signed"
    },
  ]);

  const [isAddTrainerDialogOpen, setIsAddTrainerDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newTrainer, setNewTrainer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialties: "",
    isExternal: false,
    hourlyRate: "",
    cv: "",
    certifications: ""
  });

  const specialtyOptions = [
    "Sécurité industrielle",
    "Management",
    "Informatique",
    "Commercial",
    "Qualité",
    "Environnement",
    "RH"
  ];

  const addTrainer = () => {
    if (!newTrainer.firstName || !newTrainer.lastName || !newTrainer.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const trainer: Trainer = {
      id: trainers.length + 1,
      firstName: newTrainer.firstName,
      lastName: newTrainer.lastName,
      email: newTrainer.email,
      phone: newTrainer.phone,
      specialties: newTrainer.specialties.split(",").map(s => s.trim()).filter(Boolean),
      rating: 0,
      isExternal: newTrainer.isExternal,
      hourlyRate: newTrainer.hourlyRate ? parseFloat(newTrainer.hourlyRate) : undefined,
      cv: newTrainer.cv,
      certifications: newTrainer.certifications.split(",").map(s => s.trim()).filter(Boolean),
    };

    setTrainers([...trainers, trainer]);
    setNewTrainer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialties: "",
      isExternal: false,
      hourlyRate: "",
      cv: "",
      certifications: ""
    });
    setIsAddTrainerDialogOpen(false);

    toast({
      title: "Succès",
      description: "Formateur ajouté avec succès.",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "outline";
      case "signed": return "secondary";
      case "completed": return "default";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft": return "Brouillon";
      case "signed": return "Signé";
      case "completed": return "Terminé";
      case "cancelled": return "Annulé";
      default: return status;
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Formateurs</h1>
                <p className="text-gray-600">Formateurs internes et prestataires externes</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Tabs defaultValue="formateurs" className="space-y-6">
              <TabsList>
                <TabsTrigger value="formateurs">Formateurs</TabsTrigger>
                <TabsTrigger value="disponibilites">Disponibilités</TabsTrigger>
                <TabsTrigger value="contrats">Contrats</TabsTrigger>
                <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
              </TabsList>

              <TabsContent value="formateurs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Fiches formateurs
                        </CardTitle>
                        <CardDescription>Gestion des profils et compétences</CardDescription>
                      </div>
                      <Dialog open={isAddTrainerDialogOpen} onOpenChange={setIsAddTrainerDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un formateur
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Nouveau formateur</DialogTitle>
                            <DialogDescription>Ajoutez un nouveau formateur à l'équipe</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="firstName">Prénom *</Label>
                                <Input
                                  id="firstName"
                                  value={newTrainer.firstName}
                                  onChange={(e) => setNewTrainer({ ...newTrainer, firstName: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="lastName">Nom *</Label>
                                <Input
                                  id="lastName"
                                  value={newTrainer.lastName}
                                  onChange={(e) => setNewTrainer({ ...newTrainer, lastName: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={newTrainer.email}
                                  onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                  id="phone"
                                  value={newTrainer.phone}
                                  onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                              <Input
                                id="specialties"
                                value={newTrainer.specialties}
                                onChange={(e) => setNewTrainer({ ...newTrainer, specialties: e.target.value })}
                                placeholder="Sécurité, Management, Informatique"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="isExternal"
                                checked={newTrainer.isExternal}
                                onChange={(e) => setNewTrainer({ ...newTrainer, isExternal: e.target.checked })}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor="isExternal">Formateur externe</Label>
                            </div>
                            {newTrainer.isExternal && (
                              <div>
                                <Label htmlFor="hourlyRate">Tarif horaire (€)</Label>
                                <Input
                                  id="hourlyRate"
                                  type="number"
                                  value={newTrainer.hourlyRate}
                                  onChange={(e) => setNewTrainer({ ...newTrainer, hourlyRate: e.target.value })}
                                />
                              </div>
                            )}
                            <div>
                              <Label htmlFor="cv">CV / Expérience</Label>
                              <Textarea
                                id="cv"
                                value={newTrainer.cv}
                                onChange={(e) => setNewTrainer({ ...newTrainer, cv: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="certifications">Certifications (séparées par des virgules)</Label>
                              <Input
                                id="certifications"
                                value={newTrainer.certifications}
                                onChange={(e) => setNewTrainer({ ...newTrainer, certifications: e.target.value })}
                                placeholder="PMP, CNAM, IOSH"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsAddTrainerDialogOpen(false)}>Annuler</Button>
                              <Button onClick={addTrainer}>Ajouter</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Formateur</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Spécialités</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead>Tarif</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainers.map((trainer) => (
                          <TableRow key={trainer.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {getInitials(trainer.firstName, trainer.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {trainer.firstName} {trainer.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate max-w-xs">
                                    {trainer.certifications.join(", ")}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={trainer.isExternal ? "default" : "secondary"}>
                                {trainer.isExternal ? "Externe" : "Interne"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {trainer.specialties.slice(0, 2).map((specialty, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                                {trainer.specialties.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{trainer.specialties.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {trainer.rating > 0 ? (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{trainer.rating}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {trainer.hourlyRate ? `${trainer.hourlyRate}€/h` : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{trainer.email}</div>
                                <div className="text-gray-600">{trainer.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">Voir détail</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disponibilites" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Planning des disponibilités
                    </CardTitle>
                    <CardDescription>Gestion des créneaux disponibles par formateur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Sélectionner une date</h3>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={fr}
                          className="rounded-md border"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">
                          Disponibilités {selectedDate && format(selectedDate, "dd MMMM yyyy", { locale: fr })}
                        </h3>
                        <div className="space-y-3">
                          {trainers.map((trainer) => (
                            <Card key={trainer.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                      {getInitials(trainer.firstName, trainer.lastName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {trainer.firstName} {trainer.lastName}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant="secondary">09:00-12:00</Badge>
                                  <Badge variant="outline">14:00-17:00</Badge>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contrats" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Contrats et facturation
                        </CardTitle>
                        <CardDescription>Gestion des contrats de prestation</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau contrat
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Formateur</TableHead>
                          <TableHead>Formation</TableHead>
                          <TableHead>Période</TableHead>
                          <TableHead>Tarif</TableHead>
                          <TableHead>Heures</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contracts.map((contract) => {
                          const trainer = trainers.find(t => t.id === contract.trainerId);
                          return (
                            <TableRow key={contract.id}>
                              <TableCell>
                                {trainer && (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                        {getInitials(trainer.firstName, trainer.lastName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">
                                      {trainer.firstName} {trainer.lastName}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{contract.trainingName}</TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{contract.startDate}</div>
                                  <div className="text-gray-600">au {contract.endDate}</div>
                                </div>
                              </TableCell>
                              <TableCell>{contract.hourlyRate}€/h</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {contract.totalHours}h
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {(contract.hourlyRate * contract.totalHours).toLocaleString()}€
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(contract.status)}>
                                  {getStatusLabel(contract.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Voir</Button>
                                  <Button variant="outline" size="sm">
                                    <Euro className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evaluations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Évaluations des formateurs
                    </CardTitle>
                    <CardDescription>Notes et commentaires des participants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trainers.map((trainer) => (
                        <Card key={trainer.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {getInitials(trainer.firstName, trainer.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {trainer.firstName} {trainer.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {trainer.specialties.join(", ")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xl font-bold">{trainer.rating || "N/A"}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {trainer.rating > 0 ? "12 évaluations" : "Aucune évaluation"}
                              </p>
                            </div>
                          </div>
                          {trainer.rating > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Pédagogie</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Expertise</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4].map((star) => (
                                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                  <Star className="h-3 w-3 text-gray-300" />
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TrainersManagement;
