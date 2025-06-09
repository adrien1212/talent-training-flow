import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import useSessionEnrollments from '@/hooks/useSessionEnrollments';
import { SessionStatus } from '@/types/SessionStatus';

interface PendingFeedbackTableProps {
    employeeId?: number;
    trainingId?: number;
    sessionId?: number;
    pageSize?: number;
}

const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase();
};

const FeedbackPending: React.FC<PendingFeedbackTableProps> = ({
    employeeId,
    trainingId,
    sessionId,
    pageSize = 10,
}) => {
    const [page, setPage] = useState<number>(0);

    const { data, isLoading, error } = useSessionEnrollments({
        trainingId,
        sessionId,
        employeeId,
        status: SessionStatus.Active,
        completed: false,
        page,
        size: pageSize,
    });

    function onSendReminder(employeeId: number): void {
        // TODO: call backend to resend email reminder
        console.log('Envoyer relance pour employeeId:', employeeId);
    }

    return (
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
                            <TableHead>Formation</TableHead>
                            <TableHead>Date de session</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && data.content.length > 0 ? (
                            data.content.map(pending => (
                                <TableRow key={pending.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback className="bg-orange-100 text-orange-700">
                                                    {getInitials(pending.employee.firstName + ' ' + pending.employee.lastName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    {pending.employee.firstName} {pending.employee.lastName}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {pending.employee.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{pending.session.training.title}</Badge>
                                    </TableCell>
                                    <TableCell>{pending.session.startDate}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onSendReminder(pending.employee.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <Send className="h-3 w-3" />
                                            Relance
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    Aucun feedback en attente.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {!isLoading && !error && data.totalPages > 1 && (
                    <div className="flex justify-between items-center p-4">
                        <Button
                            disabled={page <= 0}
                            onClick={() => setPage(p => Math.max(p - 1, 0))}
                        >
                            Previous
                        </Button>
                        <span>
                            Page {page + 1} of {data.totalPages}
                        </span>
                        <Button
                            disabled={page + 1 >= data.totalPages}
                            onClick={() =>
                                setPage(p => Math.min(p + 1, data.totalPages - 1))
                            }
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FeedbackPending;