import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Plus, Trash2, Filter } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

interface Session {
  id: number;
  trainingName: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  registeredParticipants: number;
}

interface SessionParticipant {
  employeeId: number;
  sessionId: number;
  status: 'registered' | 'completed' | 'absent';
}

const AddEmployeeToSession = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const employees: Employee[] = [
    { id: 1, firstName: "Jean", lastName: "Martin", email: "jean.martin@company.com", department: "Production" },
    { id: 2, firstName: "Marie", lastName: "Dubois", email: "marie.dubois@company.com", department: "RH" },
    { id: 3, firstName: "Paul", lastName: "Durand", email: "paul.durand@company.com", department: "Production" },
    { id: 4, firstName: "Sophie", lastName: "Leroy", email: "sophie.leroy@company.com", department: "IT" },
    { id: 5, firstName: "Pierre", lastName: "Moreau", email: "pierre.moreau@company.com", department: "Commercial" },
  ];

  const sessions: Session[] = [
    { id: 1, trainingName: "Sécurité au travail", date: "2024-06-15", time: "09:00", location: "Salle A", maxParticipants: 20, registeredParticipants: 15 },
    { id: 2, trainingName: "Formation Excel", date: "2024-06-18", time: "14:00", location: "Salle B", maxParticipants: 15, registeredParticipants: 8 },
    { id: 3, trainingName: "Management", date: "2024-06-20", time: "10:00", location: "Salle C", maxParticipants: 12, registeredParticipants: 5 },
  ];

  const [sessionParticipants, setSessionParticipants] = useState<SessionParticipant[]>([
    { employeeId: 1, sessionId: 1, status: 'registered' },
    { employeeId: 2, sessionId: 1, status: 'registered' },
    { employeeId: 3, sessionId: 2, status: 'registered' },
  ]);

  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getSessionParticipants = (sessionId: number) => {
    return sessionParticipants
      .filter(sp => sp.sessionId === sessionId)
      .map(sp => employees.find(emp => emp.id === sp.employeeId))
      .filter(Boolean) as Employee[];
  };

  const addEmployeeToSession = (employeeId: number) => {
    if (!selectedSession) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une session.",
        variant: "destructive",
      });
      return;
    }

    const isAlreadyRegistered = sessionParticipants.some(
      sp => sp.employeeId === employeeId && sp.sessionId === selectedSession
    );

    if (isAlreadyRegistered) {
      toast({
        title: "Erreur",
        description: "Cet employé est déjà inscrit à cette session.",
        variant: "destructive",
      });
      return;
    }

    setSessionParticipants([
      ...sessionParticipants,
      { employeeId, sessionId: selectedSession, status: 'registered' }
    ]);

    toast({
      title: "Succès",
      description: "Employé ajouté à la session avec succès.",
    });
  };

  const removeEmployeeFromSession = (employeeId: number, sessionId: number) => {
    setSessionParticipants(
      sessionParticipants.filter(sp => !(sp.employeeId === employeeId && sp.sessionId === sessionId))
    );

    toast({
      title: "Succès",
      description: "Employé retiré de la session.",
    });
  };

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Participants</h1>
                <p className="text-gray-600">Ajoutez ou retirez des employés des sessions</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sessions disponibles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Sessions disponibles
                  </CardTitle>
                  <CardDescription>Sélectionnez une session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSession === session.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <div className="font-medium">{session.trainingName}</div>
                        <div className="text-sm text-gray-600">{session.date} à {session.time}</div>
                        <div className="text-sm text-gray-600">{session.location}</div>
                        <Badge variant="secondary" className="mt-1">
                          {session.registeredParticipants}/{session.maxParticipants}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Liste des employés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employés disponibles
                  </CardTitle>
                  <CardDescription>Recherchez et ajoutez des employés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filtres */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher par nom ou email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrer par département" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TODO-rename">Tous les départements</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Liste des employés */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getInitials(employee.firstName, employee.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-xs text-gray-600">{employee.department}</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addEmployeeToSession(employee.id)}
                            disabled={!selectedSession}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants à la session sélectionnée */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participants inscrits
                  </CardTitle>
                  <CardDescription>
                    {selectedSession 
                      ? `Session: ${sessions.find(s => s.id === selectedSession)?.trainingName}`
                      : "Sélectionnez une session"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSession ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getSessionParticipants(selectedSession).map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                {getInitials(employee.firstName, employee.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-xs text-gray-600">{employee.department}</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeEmployeeFromSession(employee.id, selectedSession)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {getSessionParticipants(selectedSession).length === 0 && (
                        <p className="text-center text-gray-500 py-4">Aucun participant inscrit</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">Sélectionnez une session pour voir les participants</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AddEmployeeToSession;