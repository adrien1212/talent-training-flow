
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: number;
  trainingName: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  maxParticipants: number;
  registeredParticipants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

const Sessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, trainingName: "Sécurité au travail", date: "2024-06-15", time: "09:00", location: "Salle de formation A", instructor: "Marie Dubois", maxParticipants: 20, registeredParticipants: 15, status: 'scheduled' },
    { id: 2, trainingName: "Management d'équipe", date: "2024-06-12", time: "14:00", location: "Salle de réunion", instructor: "Jean Martin", maxParticipants: 12, registeredParticipants: 12, status: 'ongoing' },
    { id: 3, trainingName: "Formation Excel", date: "2024-06-10", time: "10:00", location: "Salle informatique", instructor: "Sophie Leroy", maxParticipants: 15, registeredParticipants: 14, status: 'completed' },
    { id: 4, trainingName: "Techniques de vente", date: "2024-06-20", time: "13:30", location: "Salle de formation B", instructor: "Pierre Moreau", maxParticipants: 10, registeredParticipants: 3, status: 'cancelled' },
  ]);

  const trainings = ["Sécurité au travail", "Management d'équipe", "Formation Excel", "Techniques de vente"];
  const instructors = ["Marie Dubois", "Jean Martin", "Sophie Leroy", "Pierre Moreau"];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    trainingName: "",
    date: "",
    time: "",
    location: "",
    instructor: "",
    maxParticipants: 0,
    status: 'scheduled' as Session['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSession) {
      setSessions(sessions.map(session => 
        session.id === editingSession.id 
          ? { ...session, ...formData }
          : session
      ));
      toast({
        title: "Session modifiée",
        description: "Les informations de la session ont été mises à jour avec succès.",
      });
    } else {
      const newSession: Session = {
        id: Math.max(...sessions.map(s => s.id)) + 1,
        ...formData,
        registeredParticipants: 0
      };
      setSessions([...sessions, newSession]);
      toast({
        title: "Session créée",
        description: "La nouvelle session a été créée avec succès.",
      });
    }

    setFormData({
      trainingName: "",
      date: "",
      time: "",
      location: "",
      instructor: "",
      maxParticipants: 0,
      status: 'scheduled'
    });
    setEditingSession(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setFormData({
      trainingName: session.trainingName,
      date: session.date,
      time: session.time,
      location: session.location,
      instructor: session.instructor,
      maxParticipants: session.maxParticipants,
      status: session.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSessions(sessions.filter(session => session.id !== id));
    toast({
      title: "Session supprimée",
      description: "La session a été supprimée avec succès.",
      variant: "destructive",
    });
  };

  const openCreateDialog = () => {
    setEditingSession(null);
    setFormData({
      trainingName: "",
      date: "",
      time: "",
      location: "",
      instructor: "",
      maxParticipants: 0,
      status: 'scheduled'
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: Session['status']) => {
    const variants = {
      scheduled: { variant: "default" as const, label: "Programmée", color: "bg-blue-100 text-blue-800" },
      ongoing: { variant: "default" as const, label: "En cours", color: "bg-green-100 text-green-800" },
      completed: { variant: "secondary" as const, label: "Terminée", color: "bg-gray-100 text-gray-800" },
      cancelled: { variant: "destructive" as const, label: "Annulée", color: "bg-red-100 text-red-800" }
    };
    
    const config = variants[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
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
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Sessions</h1>
                  <p className="text-gray-600">Planifiez et gérez les sessions de formation</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSession ? "Modifier la session" : "Créer une nouvelle session"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSession 
                        ? "Modifiez les informations de la session ci-dessous."
                        : "Remplissez les informations pour créer une nouvelle session."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="trainingName">Formation</Label>
                      <Select value={formData.trainingName} onValueChange={(value) => setFormData({ ...formData, trainingName: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une formation" />
                        </SelectTrigger>
                        <SelectContent>
                          {trainings.map((training) => (
                            <SelectItem key={training} value={training}>{training}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Heure</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Lieu</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Salle de formation A"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor">Formateur</Label>
                      <Select value={formData.instructor} onValueChange={(value) => setFormData({ ...formData, instructor: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un formateur" />
                        </SelectTrigger>
                        <SelectContent>
                          {instructors.map((instructor) => (
                            <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Nombre max de participants</Label>
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
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <Select value={formData.status} onValueChange={(value: Session['status']) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Programmée</SelectItem>
                          <SelectItem value="ongoing">En cours</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingSession ? "Modifier" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-lg">{session.trainingName}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(session)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(session.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>Formateur: {session.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{session.date}</span>
                        <Clock className="h-4 w-4 text-gray-500 ml-2" />
                        <span className="text-sm text-gray-600">{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{session.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Participants
                        </span>
                        <span className="font-medium">
                          {session.registeredParticipants}/{session.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Statut</span>
                        {getStatusBadge(session.status)}
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

export default Sessions;
