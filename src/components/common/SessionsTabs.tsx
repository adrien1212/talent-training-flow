// src/components/SessionsTabs.tsx

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { SessionDetail } from '@/types/SessionDetail';
import { SessionStatus } from '@/types/SessionStatus';
import {
    useSessions,
    useDeleteSession,
} from '@/hooks/useSessions';
import SessionDialog from './SessionDialog';

interface SessionsTabsProps {
    trainingId?: string;
}

const statusMap: Record<SessionStatus, { label: string; style: string }> = {
    DRAFT: { label: "À l'étude", style: 'bg-orange-100 text-orange-800' },
    NOT_STARTED: { label: 'Programmée', style: 'bg-blue-100 text-blue-800' },
    ACTIVE: { label: 'En cours', style: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Terminée', style: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Annulée', style: 'bg-red-100 text-red-800' },
};

export default function SessionsTabs({ trainingId }: SessionsTabsProps) {
    const navigate = useNavigate();
    const tid = trainingId ? Number(trainingId) : undefined;
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<SessionDetail | null>(null);
    const [createSession, setCreateSession] = useState<SessionDetail | null>(null);


    // DATA
    const { data: response, isLoading, isError, error } =
        useSessions({ trainingId: tid, page, size: pageSize });
    const { mutate: deleteSession, isLoading: isDeleting } =
        useDeleteSession({ trainingId: tid, page, size: pageSize });

    const busy = isDeleting;
    const sessions = response?.content ?? [];
    const totalPages = response?.totalPages ?? 0;

    // FILTERS
    const filtered = useMemo(
        () => ({
            all: sessions,
            active: sessions.filter(s => s.status === SessionStatus.Active),
            completed: sessions.filter(s => s.status === SessionStatus.Completed),
            notStarted: sessions.filter(s => s.status === SessionStatus.NotStarted || s.status === SessionStatus.Draft),
        }),
        [sessions]
    );

    const getStatusBadge = (status: SessionDetail['status']) => {
        console.log(status + ": " + statusMap[status])
        const cfg = statusMap[status];
        return <Badge className={cfg.style}>{cfg.label}</Badge>;
    };

    const openDialog = (session?: SessionDetail) => {
        setEditingSession(session ?? null);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteSession(id, {
            onSuccess: async () => toast({ title: 'Session supprimée', description: "", variant: 'default' }),
            onError: async () => toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' }),
        });
    };

    if (isLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    if (isError) return <div className="p-4 text-center text-red-500">Erreur : {error?.message}</div>;

    const renderTable = (list: SessionDetail[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Formation</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map(session => (
                    <TableRow
                        key={session.id}
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => navigate(`/sessions/${session.id}`)}
                    >
                        <TableCell>{session.training.title}</TableCell>
                        <TableCell>{new Date(session.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{session.endDate && new Date(session.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={e => { e.stopPropagation(); openDialog(session); }}
                                    disabled={busy}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={e => { e.stopPropagation(); handleDelete(session.id); }}
                                    disabled={busy}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <>
            <SessionDialog
                open={isDialogOpen}
                session={editingSession}
                defaultTrainingId={tid}
                onClose={() => {
                    setIsDialogOpen(false)
                }}
            />

            <Button onClick={() => { setCreateSession(null); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />Nouvelle Session
            </Button>

            <Tabs defaultValue="toutes" className="w-full">
                <TabsList>
                    <TabsTrigger value="toutes">Toutes</TabsTrigger>
                    <TabsTrigger value="active">Actives</TabsTrigger>
                    <TabsTrigger value="completed">Terminées</TabsTrigger>
                    <TabsTrigger value="not_started">Non commencées</TabsTrigger>
                </TabsList>

                <TabsContent value="toutes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Toutes les sessions</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(filtered.all)}</CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="active">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions actives</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(filtered.active)}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completed">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions terminées</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(filtered.completed)}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="not_started">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions non commencées</CardTitle>
                        </CardHeader>
                        <CardContent>{renderTable(filtered.notStarted)}</CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}
