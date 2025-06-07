
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, GraduationCap, Mail, Phone } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive';
}

interface Training {
  id: number;
  name: string;
  description: string;
  duration: number;
  maxParticipants: number;
  sessionsCount: number;
  status: 'active' | 'inactive';
}

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - en réalité, vous récupéreriez cela depuis votre API
  const department = {
    id: Number(id),
    name: "Production",
    description: "Fabrication et assemblage des produits",
    manager: "Jean Martin",
    employeeCount: 45
  };

  const employees: Employee[] = [
    { id: 1, firstName: "Jean", lastName: "Martin", email: "jean.martin@company.com", phone: "01 23 45 67 90", position: "Chef d'équipe", status: 'active' },
    { id: 2, firstName: "Paul", lastName: "Durand", email: "paul.durand@company.com", phone: "01 23 45 67 93", position: "Opérateur", status: 'active' },
    { id: 3, firstName: "Julie", lastName: "Bernard", email: "julie.bernard@company.com", phone: "01 23 45 67 94", position: "Technicien", status: 'active' },
    { id: 4, firstName: "Marc", lastName: "Petit", email: "marc.petit@company.com", phone: "01 23 45 67 95", position: "Opérateur", status: 'inactive' },
  ];

  const trainings: Training[] = [
    { id: 1, name: "Sécurité au travail", description: "Formation obligatoire sur les règles de sécurité", duration: 8, maxParticipants: 20, sessionsCount: 3, status: 'active' },
    { id: 2, name: "Utilisation des machines", description: "Formation sur l'utilisation sécurisée des équipements", duration: 12, maxParticipants: 15, sessionsCount: 2, status: 'active' },
    { id: 3, name: "Qualité et contrôle", description: "Procédures de contrôle qualité", duration: 6, maxParticipants: 25, sessionsCount: 1, status: 'inactive' },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
                onClick={() => navigate('/departments')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux départements
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                <p className="text-gray-600">{department.description}</p>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Department Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Informations du département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Responsable</label>
                    <p className="font-medium">{department.manager}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Nombre d'employés</label>
                    <p className="font-medium">{department.employeeCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employés du département
                </CardTitle>
                <CardDescription>
                  {employees.length} employé(s) dans ce département
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {getInitials(employee.firstName, employee.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {employee.firstName} {employee.lastName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            {employee.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {employee.phone}
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                            {employee.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Trainings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Formations disponibles
                </CardTitle>
                <CardDescription>
                  {trainings.length} formation(s) disponible(s) pour ce département
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formation</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Max participants</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings.map((training) => (
                      <TableRow key={training.id}>
                        <TableCell>
                          <div className="font-medium">{training.name}</div>
                        </TableCell>
                        <TableCell>{training.description}</TableCell>
                        <TableCell>{training.duration}h</TableCell>
                        <TableCell>{training.maxParticipants}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{training.sessionsCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={training.status === 'active' ? 'default' : 'secondary'}>
                            {training.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DepartmentDetail;
