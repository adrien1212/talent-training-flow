
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, Edit, Trash2, Clock, Users, Calendar } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Training {
  id: number;
  name: string;
  description: string;
  department: string;
  duration: number; // in hours
  maxParticipants: number;
  sessionsCount: number;
  status: 'active' | 'inactive';
}

const Trainings = () => {
  const { toast } = useToast();
  const [trainings, setTrainings] = useState<Training[]>([
    { id: 1, name: "Sécurité au travail", description: "Formation obligatoire sur les règles de sécurité", department: "Production", duration: 8, maxParticipants: 20, sessionsCount: 3, status: 'active' },
    { id: 2, name: "Management d'équipe", description: "Techniques de management et leadership", department: "Ressources Humaines", duration: 16, maxParticipants: 12, sessionsCount: 2, status: 'active' },
    { id: 3, name: "Formation Excel", description: "Maîtrise d'Excel niveau avancé", department: "Comptabilité", duration: 12, maxParticipants: 15, sessionsCount: 4, status: 'active' },
    { id: 4, name: "Techniques de vente", description: "Améliorer ses techniques commerciales", department: "Marketing", duration: 20, maxParticipants: 10, sessionsCount: 1, status: 'inactive' },
  ]);

  const departments = ["Production", "Ressources Humaines", "Comptabilité", "Marketing", "IT", "Ventes"];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    duration: 0,
    maxParticipants: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTraining) {
      setTrainings(trainings.map(training => 
        training.id === editingTraining.id 
          ? { ...training, ...formData }
          : training
      ));
      toast({
        title: "Formation modifiée",
        description: "Les informations de la formation ont été mises à jour avec succès.",
      });
    } else {
      const newTraining: Training = {
        id: Math.max(...trainings.map(t => t.id)) + 1,
        ...formData,
        sessionsCount: 0
      };
      setTrainings([...trainings, newTraining]);
      toast({
        title: "Formation créée",
        description: "La nouvelle formation a été créée avec succès.",
      });
    }

    setFormData({
      name: "",
      description: "",
      department: "",
      duration: 0,
      maxParticipants: 0,
      status: 'active'
    });
    setEditingTraining(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setFormData({
      name: training.name,
      description: training.description,
      department: training.department,
      duration: training.duration,
      maxParticipants: training.maxParticipants,
      status: training.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTrainings(trainings.filter(training => training.id !== id));
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès.",
      variant: "destructive",
    });
  };

  const openCreateDialog = () => {
    setEditingTraining(null);
    setFormData({
      name: "",
      description: "",
      department: "",
      duration: 0,
      maxParticipants: 0,
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
                  <p className="text-gray-600">Créez et gérez les formations de votre organisation</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Formation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTraining ? "Modifier la formation" : "Créer une nouvelle formation"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTraining 
                        ? "Modifiez les informations de la formation ci-dessous."
                        : "Remplissez les informations pour créer une nouvelle formation."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom de la formation</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Sécurité au travail"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description de la formation..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Département cible</Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Durée (heures)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                          placeholder="8"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxParticipants">Max participants</Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                          placeholder="20"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingTraining ? "Modifier" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map((training) => (
                <Card key={training.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg">{training.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(training)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(training.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{training.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Département</span>
                        <Badge variant="outline">{training.department}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Durée
                        </span>
                        <span className="font-medium">{training.duration}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Max participants
                        </span>
                        <span className="font-medium">{training.maxParticipants}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sessions
                        </span>
                        <Badge variant="secondary">{training.sessionsCount}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Statut</span>
                        <Badge variant={training.status === 'active' ? 'default' : 'secondary'}>
                          {training.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Trainings;
