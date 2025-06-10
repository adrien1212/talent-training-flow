import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, PenTool, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface PublicSession {
    id: number;
    startDate: string;
    endDate: string;
    location: string;
    status: string;
    accessToken: string;
    training: {
        id: number;
        name: string;
    };
    sessionsEnrollment: PublicSessionEnrollment[];
}

interface PublicSessionEnrollment {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    hasSigned: boolean;
    signatureToken: string;
}

const SessionSignature = () => {
    const { employeeAccessToken } = useParams();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [session, setSession] = useState<PublicSession | null>(null);
    const [participants, setParticipants] = useState<PublicSessionEnrollment[]>([]);


    useEffect(() => {
        async function fetchSession() {
            try {

                const response = await api(`/v1/public/sessions/${employeeAccessToken}`);
                if (response.status !== 200) {
                    throw new Error("Session non trouvée");
                    console.log("ddd" + employeeAccessToken)
                }
                const data: PublicSession = await response.data;
                setSession(data);
                setParticipants(data.sessionsEnrollment);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchSession();
    }, []);

    const getInitials = (firstName: string, lastName: string) =>
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    const [selectedParticipant, setSelectedParticipant] = useState<PublicSessionEnrollment | null>(null);
    const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
    const [signature, setSignature] = useState("");

    const handleSignature = async () => {
        if (!selectedParticipant || !signature.trim()) {
            toast({
                title: "Erreur",
                description: "Veuillez saisir votre signature.",
                variant: "destructive",
            });
            return;
        }

        try {
            const res = await api(
                `/v1/sessions-enrollments/sign/${selectedParticipant.signatureToken}`,
                {
                    method: "POST",
                    body: JSON.stringify({ signature }),
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (res.status !== 200) throw new Error("Erreur lors de l'enregistrement");

            setParticipants(prev =>
                prev.map(p =>
                    p.id === selectedParticipant.id
                        ? { ...p, hasSigned: true }
                        : p
                )
            );
            toast({
                title: "Signature enregistrée",
                description: `Présence confirmée pour ${selectedParticipant.firstName} ${selectedParticipant.lastName}`,
            });
        } catch (err) {
            console.error(err);
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer la signature.",
                variant: "destructive",
            });
        } finally {
            setSignature("");
            setSelectedParticipant(null);
            setIsSignatureDialogOpen(false);
        }

    };

    const openSignatureDialog = (participant: PublicSessionEnrollment) => {
        setSelectedParticipant(participant);
        setIsSignatureDialogOpen(true);
    };

    const signedCount = participants.filter(p => p.hasSigned).length;

    if (loading) return <div>Chargement...</div>;
    if (error || !session) return <div>Session non trouvée</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PenTool className="h-6 w-6 text-blue-600" />
                            Feuille de signature - {session.training.name}
                        </CardTitle>
                        <CardDescription>
                            {session.startDate} ↔︎ {session.endDate} • {session.location}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-600" />
                                <span className="font-medium">{participants.length} participants</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-green-600">{signedCount} présences confirmées</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Participants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des participants</CardTitle>
                        <CardDescription>
                            Cliquez sur "Signer" pour confirmer la présence d'un participant
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Participant</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participants.map(participant => (
                                    <TableRow key={participant.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                                        {getInitials(participant.firstName, participant.lastName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">
                                                    {participant.firstName} {participant.lastName}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{participant.email}</TableCell>
                                        <TableCell>
                                            {participant.hasSigned ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <span className="text-green-700 font-medium">Présent</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                    <span className="text-gray-500">En attente</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {!participant.hasSigned && (
                                                <Button
                                                    onClick={() => openSignatureDialog(participant)}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <PenTool className="h-4 w-4 mr-2" />
                                                    Signer
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Signature Dialog */}
                <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Signature de présence</DialogTitle>
                            <DialogDescription>
                                Confirmez la présence de {selectedParticipant?.firstName} {selectedParticipant?.lastName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="signature">Signature du participant</Label>
                                <Input
                                    id="signature"
                                    value={signature}
                                    onChange={e => setSignature(e.target.value)}
                                    placeholder="Tapez votre nom pour confirmer votre présence"
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsSignatureDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button onClick={handleSignature} className="bg-blue-600 hover:bg-blue-700">
                                    Confirmer
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default SessionSignature;