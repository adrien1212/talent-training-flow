
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, PenTool, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  hasSigned: boolean;
  signatureTime?: string;
}

const SessionSignature = () => {
  const { accessToken } = useParams();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, firstName: "Jean", lastName: "Martin", email: "jean.martin@company.com", department: "Production", hasSigned: true, signatureTime: "2024-06-09 09:15" },
    { id: 2, firstName: "Marie", lastName: "Dubois", email: "marie.dubois@company.com", department: "RH", hasSigned: false },
    { id: 3, firstName: "Pierre", lastName: "Moreau", email: "pierre.moreau@company.com", department: "Marketing", hasSigned: false },
    { id: 4, firstName: "Sophie", lastName: "Leroy", email: "sophie.leroy@company.com", department: "Comptabilité", hasSigned: true, signatureTime: "2024-06-09 09:20" },
  ]);

  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [signature, setSignature] = useState("");

  // Mock session data
  const session = {
    id: 1,
    trainingName: "Sécurité au travail",
    date: "2024-06-09",
    time: "09:00 - 12:00",
    location: "Salle de formation A",
    instructor: "Dr. Martin Leclerc"
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSignature = () => {
    if (!selectedParticipant || !signature.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre signature.",
        variant: "destructive",
      });
      return;
    }

    setParticipants(participants.map(p => 
      p.id === selectedParticipant.id 
        ? { ...p, hasSigned: true, signatureTime: new Date().toLocaleString('fr-FR') }
        : p
    ));

    toast({
      title: "Signature enregistrée",
      description: `Présence confirmée pour ${selectedParticipant.firstName} ${selectedParticipant.lastName}`,
    });

    setSignature("");
    setSelectedParticipant(null);
    setIsSignatureDialogOpen(false);
  };

  const openSignatureDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsSignatureDialogOpen(true);
  };

  const signedCount = participants.filter(p => p.hasSigned).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-6 w-6 text-blue-600" />
              Feuille de signature - {session.trainingName}
            </CardTitle>
            <CardDescription>
              {session.date} • {session.time} • {session.location} • Formateur: {session.instructor}
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
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Heure de signature</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(participant.firstName, participant.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {participant.firstName} {participant.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{participant.email}</TableCell>
                    <TableCell>{participant.department}</TableCell>
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
                      {participant.signatureTime || "-"}
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
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Tapez votre nom pour confirmer votre présence"
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSignatureDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSignature} className="bg-blue-600 hover:bg-blue-700">
                  Confirmer la présence
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
