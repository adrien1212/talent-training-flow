
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, User, Calendar, Mail, Phone, Building } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface SessionParticipation {
  sessionId: number;
  trainingName: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'absent';
  feedback?: {
    rating: number;
    comment: string;
  };
}

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - en réalité, vous récupéreriez cela depuis votre API
  const employee = {
    id: Number(id),
    firstName: "Jean",
    lastName: "Martin",
    email: "jean.martin@company.com",
    phone: "01 23 45 67 90",
    department: "Production",
    position: "Chef d'équipe",
    hireDate: "2020-03-15",
    status: 'active' as 'active' | 'inactive'
  };

  const sessionParticipations: SessionParticipation[] = [
    {
      sessionId: 1,
      trainingName: "Sécurité au travail",
      date: "2024-05-15",
      time: "09:00",
      location: "Salle A",
      status: 'completed',
      feedback: {
        rating: 4,
        comment: "Formation très utile, formateur compétent"
      }
    },
    {
      sessionId: 2,
      trainingName: "Formation Excel",
      date: "2024-06-10",
      time: "14:00",
      location: "Salle B",
      status: 'completed',
      feedback: {
        rating: 5,
        comment: "Excellente formation, très pratique"
      }
    },
    {
      sessionId: 3,
      trainingName: "Management d'équipe",
      date: "2024-06-20",
      time: "10:00",
      location: "Salle C",
      status: 'scheduled'
    },
    {
      sessionId: 4,
      trainingName: "Gestion du stress",
      date: "2024-06-25",
      time: "15:00",
      location: "Salle D",
      status: 'scheduled'
    }
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (status: SessionParticipation['status']) => {
    const variants = {
      scheduled: { variant: "default" as const, label: "Programmée", color: "bg-blue-100 text-blue-800" },
      completed: { variant: "secondary" as const, label: "Terminée", color: "bg-green-100 text-green-800" },
      absent: { variant: "destructive" as const, label: "Absent", color: "bg-red-100 text-red-800" }
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
                onClick={() => navigate('/employees')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux employés
              </Button>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {getInitials(employee.firstName, employee.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-gray-600">{employee.position} - {employee.department}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-600">Téléphone</label>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-600">Département</label>
                      <p className="font-medium">{employee.department}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Poste</label>
                    <p className="font-medium">{employee.position}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Date d'embauche</label>
                    <p className="font-medium">{employee.hireDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Statut</label>
                    <div className="mt-1">
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique des sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historique des formations
                </CardTitle>
                <CardDescription>
                  Sessions auxquelles {employee.firstName} a participé ou va participer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formation</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Heure</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Évaluation</TableHead>
                      <TableHead>Commentaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionParticipations.map((participation) => (
                      <TableRow key={participation.sessionId}>
                        <TableCell>
                          <div className="font-medium">{participation.trainingName}</div>
                        </TableCell>
                        <TableCell>{participation.date}</TableCell>
                        <TableCell>{participation.time}</TableCell>
                        <TableCell>{participation.location}</TableCell>
                        <TableCell>{getStatusBadge(participation.status)}</TableCell>
                        <TableCell>
                          {participation.feedback ? (
                            <div className="text-yellow-500">
                              {renderStars(participation.feedback.rating)}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {participation.feedback ? (
                            <div className="max-w-xs truncate" title={participation.feedback.comment}>
                              {participation.feedback.comment}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {sessionParticipations.length}
                    </div>
                    <div className="text-sm text-gray-600">Total formations</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {sessionParticipations.filter(s => s.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600">Formations terminées</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {sessionParticipations.filter(s => s.feedback).length > 0 
                        ? (sessionParticipations
                            .filter(s => s.feedback)
                            .reduce((acc, s) => acc + (s.feedback?.rating || 0), 0) / 
                           sessionParticipations.filter(s => s.feedback).length).toFixed(1)
                        : '-'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDetail;
