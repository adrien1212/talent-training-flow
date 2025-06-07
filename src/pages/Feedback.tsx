
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Star } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface FeedbackItem {
  id: number;
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  participantName: string;
  participantEmail: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

interface PendingFeedback {
  id: number;
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  participantName: string;
  participantEmail: string;
  department: string;
  completedAt: string;
}

const Feedback = () => {
  const { toast } = useToast();

  const feedbacks: FeedbackItem[] = [
    {
      id: 1,
      sessionId: 1,
      sessionName: "Sécurité au travail",
      sessionDate: "2024-06-15",
      participantName: "Jean Martin",
      participantEmail: "jean.martin@company.com",
      rating: 4,
      comment: "Formation très utile, les exemples concrets sont appréciables. Le formateur était compétent.",
      submittedAt: "2024-06-15 17:30"
    },
    {
      id: 2,
      sessionId: 1,
      sessionName: "Sécurité au travail",
      sessionDate: "2024-06-15",
      participantName: "Paul Durand",
      participantEmail: "paul.durand@company.com",
      rating: 5,
      comment: "Excellente formation ! J'ai beaucoup appris sur les nouvelles procédures de sécurité.",
      submittedAt: "2024-06-15 18:00"
    },
    {
      id: 3,
      sessionId: 2,
      sessionName: "Formation Excel",
      sessionDate: "2024-06-10",
      participantName: "Sophie Leroy",
      participantEmail: "sophie.leroy@company.com",
      rating: 5,
      comment: "Formation excellente, très pratique et bien organisée.",
      submittedAt: "2024-06-10 16:45"
    },
    {
      id: 4,
      sessionId: 2,
      sessionName: "Formation Excel",
      sessionDate: "2024-06-10",
      participantName: "Marie Dubois",
      participantEmail: "marie.dubois@company.com",
      rating: 3,
      comment: "Formation correcte mais trop rapide pour les débutants.",
      submittedAt: "2024-06-11 09:20"
    }
  ];

  const pendingFeedbacks: PendingFeedback[] = [
    {
      id: 1,
      sessionId: 1,
      sessionName: "Sécurité au travail",
      sessionDate: "2024-06-15",
      participantName: "Pierre Moreau",
      participantEmail: "pierre.moreau@company.com",
      department: "Commercial",
      completedAt: "2024-06-15 16:00"
    },
    {
      id: 2,
      sessionId: 3,
      sessionName: "Management d'équipe",
      sessionDate: "2024-06-12",
      participantName: "Julie Bernard",
      participantEmail: "julie.bernard@company.com",
      department: "Production",
      completedAt: "2024-06-12 17:30"
    },
    {
      id: 3,
      sessionId: 3,
      sessionName: "Management d'équipe",
      sessionDate: "2024-06-12",
      participantName: "Marc Petit",
      participantEmail: "marc.petit@company.com",
      department: "IT",
      completedAt: "2024-06-12 17:30"
    }
  ];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const sendReminder = (participantEmail: string, participantName: string) => {
    // Ici vous implémenteriez l'envoi de l'email de relance
    toast({
      title: "Relance envoyée",
      description: `Un email de relance a été envoyé à ${participantName} (${participantEmail})`,
    });
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Avis</h1>
                <p className="text-gray-600">Consultez et gérez les retours des participants</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{feedbacks.length}</div>
                    <div className="text-sm text-gray-600">Avis reçus</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{pendingFeedbacks.length}</div>
                    <div className="text-sm text-gray-600">Avis en attente</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{averageRating}</div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="received" className="space-y-4">
              <TabsList>
                <TabsTrigger value="received" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Avis reçus
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Avis en attente
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received">
                <Card>
                  <CardHeader>
                    <CardTitle>Tous les avis reçus</CardTitle>
                    <CardDescription>
                      {feedbacks.length} avis reçu(s) au total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feedbacks.map((feedback) => (
                        <div key={feedback.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {getInitials(feedback.participantName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{feedback.participantName}</div>
                                <div className="text-sm text-gray-600">{feedback.participantEmail}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">{feedback.submittedAt}</div>
                              <Badge variant="outline" className="mt-1">
                                {feedback.sessionName}
                              </Badge>
                            </div>
                          </div>
                          <div className="mb-2">
                            {renderStars(feedback.rating)}
                          </div>
                          <p className="text-gray-700">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Avis en attente</CardTitle>
                    <CardDescription>
                      Participants qui n'ont pas encore donné leur avis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Participant</TableHead>
                          <TableHead>Session</TableHead>
                          <TableHead>Date de session</TableHead>
                          <TableHead>Département</TableHead>
                          <TableHead>Session terminée le</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingFeedbacks.map((pending) => (
                          <TableRow key={pending.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback className="bg-orange-100 text-orange-700">
                                    {getInitials(pending.participantName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{pending.participantName}</div>
                                  <div className="text-sm text-gray-600">{pending.participantEmail}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{pending.sessionName}</Badge>
                            </TableCell>
                            <TableCell>{pending.sessionDate}</TableCell>
                            <TableCell>{pending.department}</TableCell>
                            <TableCell>{pending.completedAt}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendReminder(pending.participantEmail, pending.participantName)}
                                className="flex items-center gap-1"
                              >
                                <Send className="h-3 w-3" />
                                Relance
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

export default Feedback;
