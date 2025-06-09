import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SessionDetail } from '@/types/SessionDetail';
import { NewSession } from '@/types/NewSession';
import { SessionStatus } from '@/types/SessionStatus';
import { useCreateSession, useUpdateSession } from '@/hooks/useSessions';
import { toast } from '@/components/ui/use-toast';
import useTrainings from '@/hooks/useTrainings';
import { Training } from '@/types/Training';

interface SessionDialogProps {
    open: boolean;
    defaultTrainingId?: number;
    session?: SessionDetail | null;
    onClose: () => void;
}

type FormState = {
    trainingId: number | null;
    startDate: string;
    endDate: string;
    location: string;
    status: SessionStatus;
};

export default function SessionDialog({
    defaultTrainingId,
    open,
    session,
    onClose,
}: SessionDialogProps) {
    const isEdit = Boolean(session);
    const initialTrainingId = defaultTrainingId ? defaultTrainingId : null;
    const [formData, setFormData] = useState<FormState>({
        trainingId: null,
        startDate: '',
        endDate: '',
        location: '',
        status: SessionStatus.Draft,
    });

    // Load existing session (for edit) into form
    useEffect(() => {
        if (session) {
            setFormData({
                trainingId: session.training.id,
                startDate: session.startDate,
                endDate: session.endDate,
                location: session.location,
                status: session.status,
            });
        } else {
            setFormData({
                trainingId: initialTrainingId,
                startDate: '',
                endDate: '',
                location: '',
                status: SessionStatus.Draft,
            });
        }
    }, [session]);

    // Fetch list of trainings
    const { data: trainings, isLoading: isLoadingTrainings } = useTrainings({});

    // Create/update hooks now driven by the selected trainingId
    const createSession = useCreateSession({
        trainingId: formData.trainingId!,
    });
    const updateSession = useUpdateSession({
        trainingId: formData.trainingId!,
    });
    const busy = createSession.isLoading || updateSession.isLoading;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.trainingId == null) {
            return toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner une formation.',
            });
        }

        const payload: NewSession = {
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            status: formData.status,
        };

        const onSuccess = () => {
            toast({ title: isEdit ? 'Session mise à jour' : 'Session créée' });
            onClose();
        };

        if (isEdit && session) {
            updateSession.mutate(
                { id: session.id, data: payload },
                { onSuccess }
            );
        } else {
            createSession.mutate(payload, { onSuccess });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Modifier la session' : 'Nouvelle session'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Mettez à jour les détails de la session.'
                            : 'Remplissez les informations pour créer une session.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="training">Formation</Label>
                        <Select
                            value={formData.trainingId?.toString() ?? ''}
                            onValueChange={(val) =>
                                setFormData({ ...formData, trainingId: parseInt(val, 10) })
                            }
                            disabled={busy || isLoadingTrainings}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une formation" />
                            </SelectTrigger>
                            <SelectContent>
                                {trainings?.content.map((t) => (
                                    <SelectItem key={t.id} value={t.id.toString()}>
                                        {t.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate">Début</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: e.target.value })
                                }
                                required
                                disabled={busy}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate">Fin</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, endDate: e.target.value })
                                }
                                required
                                disabled={busy}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="location">Lieu</Label>
                        <Input
                            id="location"
                            placeholder="Salle A"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                            required
                            disabled={busy}
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Statut</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) =>
                                setFormData({
                                    ...formData,
                                    status: val as SessionStatus,
                                })
                            }
                            disabled={busy}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(SessionStatus).map((stat) => (
                                    <SelectItem key={stat} value={stat}>
                                        {stat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose} disabled={busy}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={busy || formData.trainingId == null}
                        >
                            {isEdit
                                ? busy
                                    ? 'Enregistrement…'
                                    : 'Enregistrer'
                                : busy
                                    ? 'Création…'
                                    : 'Créer'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
