
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, MapPin, Users, MessageSquare } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  status: 'registered' | 'completed' | 'absent';
}

interface Feedback {
  id: number;
  participantName: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - en réalité, vous récupéreriez cela depuis votre API
  const session = {
    id: Number(id),
    trainingName: "Sécurité au travail",
    date: "2024-06-15",
    time: "09:00",
    duration: "4h",
    location: "Salle de formation A",
    instructor: "Marie Dubois",
    maxParticipants: 20,
    registeredParticipants: 15,
    status: 'completed' as 'scheduled' | 'ongoing' | 'completed' | 'cancelled',
    description: "Formation obligatoire sur les règles de sécurité en entreprise"
  };

  const participants: Participant[] = [
    { id: 1, firstName: "Jean", lastName: "Martin", email: "jean.martin@company.com", department: "Production", status: 'completed' },
    { id: 2, firstName: "Paul", lastName: "Durand", email: "paul.durand@company.com", department: "Production", status: 'completed' },
    { id: 3, firstName: "Sophie", lastName: "Leroy", email: "sophie.leroy@company.com", department: "IT", status: 'absent' },
    { id: 4, firstName: "Pierre", lastName: "Moreau", email: "pierre.moreau@company.com", department: "Commercial", status: 'completed' },
  ];

  const feedbacks: Feedback[] = [
    {
      id: 1,
      participantName: "Jean Martin",
      rating: 4,
      comment: "Formation très utile, les exemples concrets sont appréciables. Le formateur était compétent.",
      submittedAt: "2024-06-15 17:30"
    },
    {
      id: 2,
      participantName: "Paul Durand",
      rating: 5,
      comment: "Excellente formation ! J'ai beaucoup appris sur les nouvelles procédures de sécurité.",
      submittedAt: "2024-06-15 18:00"
    },
    {
      id: 3,
      participantName: "Pierre Moreau",
      rating: 3,
      comment: "Formation correcte mais un peu longue. Certains points auraient pu être raccourcis.",
      submittedAt: "2024-06-16 09:15"
    }
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (status: Participant['status']) => {
    const variants = {
      registered: { variant: "default" as const, label: "Inscrit", color: "bg-blue-100 text-blue-800" },
      completed: { variant: "secondary" as const, label: "Terminé", color: "bg-green-100 text-green-800" },
      absent: { variant: "destructive" as const, label: "Absent", color: "bg-red-100 text-red-800" }
    };
    
    const config = variants[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getSessionStatusBadge = (status: typeof session.status) => {
    const variants = {
      scheduled: { variant: "default" as const, label: "Programmée", color: "bg-blue-100 text-blue-800" },
      ongoing: { variant: "default" as const, label: "En cours", color: "bg-yellow-100 text-yellow-800" },
      completed: { variant: "secondary" as const, label: "Terminée", color: "bg-green-100 text-green-800" },
      cancelled: { variant: "destructive" as const, label: "Annulée", color: "bg-red-100 text-red-800" }
    };
    
    const config = variants[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '-';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Button
                variant="ghost"
                onClick={() => navigate('/sessions')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux sessions
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{session.trainingName}</h1>
                <p className="text-gray-600">Session du {session.date} à {session.time}</p>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Informations de la session */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations de la session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-600">Date</label>
                      <p className="font-medium">{session.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-600">Heure</label>
                      <p className="font-medium">{session.time} ({session.duration})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-600">Lieu</label>
                      <p className="font-medium">{session.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-600">Formateur</label>
                      <p className="font-medium">{session.instructor}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Description</label>
                    <p className="font-medium">{session.description}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Participants</label>
                    <p className="font-medium">{session.registeredParticipants}/{session.maxParticipants}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Statut</label>
                    <div className="mt-1">
                      {getSessionStatusBadge(session.status)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants
                </CardTitle>
                <CardDescription>
                  {participants.length} participant(s) inscrit(s) à cette session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {getInitials(participant.firstName, participant.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {participant.firstName} {participant.lastName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>{participant.department}</TableCell>
                        <TableCell>{getStatusBadge(participant.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Avis (si session terminée) */}
            {session.status === 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Avis des participants
                  </CardTitle>
                  <CardDescription>
                    {feedbacks.length} avis reçu(s) - Note moyenne: {averageRating}/5
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{feedback.participantName}</div>
                          <div className="text-sm text-gray-500">{feedback.submittedAt}</div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-yellow-500">
                            {renderStars(feedback.rating)}
                          </div>
                          <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                        </div>
                        <p className="text-gray-700">{feedback.comment}</p>
                      </div>
                    ))}
                    {feedbacks.length === 0 && (
                      <p className="text-center text-gray-500 py-4">Aucun avis reçu pour cette session</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SessionDetail;
