import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, MapPin, Users, MessageSquare, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { SessionDetail } from "@/types/SessionDetail";
import { SessionStatus } from "@/types/SessionStatus";
import api from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackTabs from "@/components/common/FeedbackTabs";
import FeedbackPending from "@/components/common/FeedbackPending";
import SessionEnrollmentCard from "@/components/common/SessionEnrollmentTable";
import { useSession } from "@/hooks/useSessions";

const SessionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: session,
        isLoading,
        isError,
        error
    } = useSession(Number(id))


    if (isLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>
    if (isError) return <div className="p-4 text-center text-red-500">Erreur de chargement</div>

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
                                <h1 className="text-2xl font-bold text-gray-900">{session.training.title}</h1>
                                <p className="text-gray-600">Session du {session.startDate} à {session.endDate}</p>
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
                                            <p className="font-medium">{session.startDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <label className="text-sm text-gray-600">Heure</label>
                                            <p className="font-medium">{session.startDate} ({session.endDate})</p>
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

                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div>
                                            <label className="text-sm text-gray-600">Status</label>
                                            <p className="font-medium">{session.status}</p>
                                        </div>
                                        <div className="mt-1">
                                            <ul className="list-disc list-inside">
                                                {session.sessionStatusHistory.map((h) => (
                                                    <li key={h.id}>
                                                        {h.status} - {new Date(h.changedAt).toLocaleDateString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Liste des participants */}
                        <SessionEnrollmentCard sessionId={Number(id)} />

                        {/* Avis (si session terminée) */}
                        {session.status === SessionStatus.Completed && (
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
                                    <FeedbackTabs sessionId={Number(id)} pageSize={20} />
                                </TabsContent>

                                <TabsContent value="pending">
                                    <FeedbackPending sessionId={Number(id)} pageSize={20} />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default SessionDetailPage;
