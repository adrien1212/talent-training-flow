
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Upload, Users, Calendar, Clock, FileText } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: number;
  name: string;
  date: string;
  status: 'active' | 'completed' | 'not_started';
  participants: number;
  maxParticipants: number;
}

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: 'current' | 'completed' | 'scheduled';
  sessionName?: string;
}

const TrainingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Mock data - en réalité, vous récupéreriez cela depuis votre API
  const training = {
    id: Number(id),
    name: "Sécurité au travail",
    description: "Formation obligatoire sur les règles de sécurité",
    department: "Production",
    duration: 8,
    maxParticipants: 20,
    status: 'active' as const
  };

  const sessions: Session[] = [
    { id: 1, name: "Session 1 - Introduction", date: "2024-01-15", status: 'completed', participants: 15, maxParticipants: 20 },
    { id: 2, name: "Session 2 - Pratique", date: "2024-01-22", status: 'active', participants: 12, maxParticipants: 20 },
    { id: 3, name: "Session 3 - Évaluation", date: "2024-01-29", status: 'not_started', participants: 0, maxParticipants: 20 },
  ];

  const participants: Participant[] = [
    { id: 1, firstName: "Jean", lastName: "Martin", email: "jean.martin@company.com", status: 'completed', sessionName: "Session 1" },
    { id: 2, firstName: "Sophie", lastName: "Leroy", email: "sophie.leroy@company.com", status: 'current', sessionName: "Session 2" },
    { id: 3, firstName: "Pierre", lastName: "Moreau", email: "pierre.moreau@company.com", status: 'scheduled', sessionName: "Session 3" },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      toast({
        title: "Fichier téléchargé",
        description: `Le fichier ${file.name} a été téléchargé avec succès.`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF valide.",
        variant: "destructive",
      });
    }
  };

  const getSessionsByStatus = (status: 'active' | 'completed' | 'not_started') => {
    return sessions.filter(session => session.status === status);
  };

  const getParticipantsByStatus = (status: 'current' | 'completed' | 'scheduled') => {
    return participants.filter(participant => participant.status === status);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      not_started: 'outline',
      current: 'default',
      scheduled: 'outline'
    } as const;
    
    const labels = {
      active: 'Active',
      completed: 'Terminée',
      not_started: 'Non commencée',
      current: 'En cours',
      scheduled: 'Programmé'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
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
                onClick={() => navigate('/trainings')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux formations
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{training.name}</h1>
                <p className="text-gray-600">{training.description}</p>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Training Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations de la formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Département</Label>
                    <p className="font-medium">{training.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Durée</Label>
                    <p className="font-medium">{training.duration} heures</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Participants max</Label>
                    <p className="font-medium">{training.maxParticipants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PDF Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Support de formation (PDF)
                </CardTitle>
                <CardDescription>
                  Téléchargez le document PDF de la formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-upload">Fichier PDF</Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">{uploadedFile.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="sessions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-4">
                <Tabs defaultValue="active" className="w-full">
                  <TabsList>
                    <TabsTrigger value="active">Actives</TabsTrigger>
                    <TabsTrigger value="completed">Terminées</TabsTrigger>
                    <TabsTrigger value="not_started">Non commencées</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sessions actives</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Participants</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getSessionsByStatus('active').map((session) => (
                              <TableRow key={session.id}>
                                <TableCell>{session.name}</TableCell>
                                <TableCell>{session.date}</TableCell>
                                <TableCell>{session.participants}/{session.maxParticipants}</TableCell>
                                <TableCell>{getStatusBadge(session.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="completed">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sessions terminées</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Participants</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getSessionsByStatus('completed').map((session) => (
                              <TableRow key={session.id}>
                                <TableCell>{session.name}</TableCell>
                                <TableCell>{session.date}</TableCell>
                                <TableCell>{session.participants}/{session.maxParticipants}</TableCell>
                                <TableCell>{getStatusBadge(session.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="not_started">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sessions non commencées</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Participants</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getSessionsByStatus('not_started').map((session) => (
                              <TableRow key={session.id}>
                                <TableCell>{session.name}</TableCell>
                                <TableCell>{session.date}</TableCell>
                                <TableCell>{session.participants}/{session.maxParticipants}</TableCell>
                                <TableCell>{getStatusBadge(session.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="participants" className="space-y-4">
                <Tabs defaultValue="current" className="w-full">
                  <TabsList>
                    <TabsTrigger value="current">En cours</TabsTrigger>
                    <TabsTrigger value="completed">Terminé</TabsTrigger>
                    <TabsTrigger value="scheduled">Programmé</TabsTrigger>
                  </TabsList>

                  <TabsContent value="current">
                    <Card>
                      <CardHeader>
                        <CardTitle>Participants en cours</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Session</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getParticipantsByStatus('current').map((participant) => (
                              <TableRow key={participant.id}>
                                <TableCell>{participant.firstName} {participant.lastName}</TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>{participant.sessionName}</TableCell>
                                <TableCell>{getStatusBadge(participant.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="completed">
                    <Card>
                      <CardHeader>
                        <CardTitle>Participants ayant terminé</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Session</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getParticipantsByStatus('completed').map((participant) => (
                              <TableRow key={participant.id}>
                                <TableCell>{participant.firstName} {participant.lastName}</TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>{participant.sessionName}</TableCell>
                                <TableCell>{getStatusBadge(participant.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="scheduled">
                    <Card>
                      <CardHeader>
                        <CardTitle>Participants programmés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Session</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getParticipantsByStatus('scheduled').map((participant) => (
                              <TableRow key={participant.id}>
                                <TableCell>{participant.firstName} {participant.lastName}</TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>{participant.sessionName}</TableCell>
                                <TableCell>{getStatusBadge(participant.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TrainingDetail;
