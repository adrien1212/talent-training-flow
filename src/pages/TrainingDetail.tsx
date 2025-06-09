import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Upload, Users, Calendar, Clock, FileText, MessageSquare, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { SessionDetail } from "@/types/SessionDetail";
import { Training } from "@/types/Training";
import { SessionStatus } from "@/types/SessionStatus";
import api from "@/services/api";
import { PageResponse } from "@/types/PageResponse";
import SessionsTabs from "@/components/common/SessionsTabs";
import TrainingSessionEnrollmentTabs from "@/components/common/TrainingSessionEnrollmentTabs";
import FeedbackTabs from "@/components/common/FeedbackTabs";
import FeedbackPending from "@/components/common/FeedbackPending";

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

    const [training, setTraining] = useState<Training>();

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const res = await api.get(`v1/trainings/${id}`);
                setTraining(res.data);
            } catch (err) {
                console.error(err);
                toast({
                    title: "Erreur de chargement",
                    description: "Impossible de récupérer la formation.",
                    variant: "destructive",
                });
            }
        };
        if (id) fetchTraining();
    }, [id, toast]);


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

    const getParticipantsByStatus = (status: Participant['status']) => {
        if (!training) return [];
        return []
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

    if (!training) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement…
            </div>
        );
    }

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
                                <h1 className="text-2xl font-bold text-gray-900">{training.title}</h1>
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
                                        {training.departments.map((dpt) => (
                                            <div key={dpt.id}>
                                                <Label>Département</Label>
                                                <p>{dpt.name}</p>
                                            </div>
                                        ))}
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
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                                <TabsTrigger value="participants">Participants</TabsTrigger>
                                <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
                            </TabsList>

                            {/* Tabs */}
                            <TabsContent value="sessions">
                                <SessionsTabs
                                    trainingId={id!}
                                    getStatusBadge={getStatusBadge}
                                />
                            </TabsContent>

                            <TabsContent value="participants" className="space-y-4">
                                <TrainingSessionEnrollmentTabs
                                    trainingId={id!}
                                />
                            </TabsContent>

                            <TabsContent value="feedbacks" className="space-y-4">
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
                                        <FeedbackTabs pageSize={20} />
                                    </TabsContent>

                                    <TabsContent value="pending">
                                        <FeedbackPending pageSize={20} />
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