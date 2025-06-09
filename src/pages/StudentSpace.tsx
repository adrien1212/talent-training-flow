
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Key, User, Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: number;
  trainingName: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  status: 'scheduled' | 'completed' | 'in_progress';
  description: string;
}

const StudentSpace = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'code' | 'dashboard'>('email');
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [employee, setEmployee] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const mockEmployee = {
    id: 1,
    firstName: "Jean",
    lastName: "Martin",
    email: "jean.martin@company.com",
    department: "Production",
    position: "Chef d'équipe"
  };

  const mockSessions: Session[] = [
    {
      id: 1,
      trainingName: "Sécurité au travail",
      date: "2024-05-15",
      time: "09:00 - 12:00",
      location: "Salle A",
      instructor: "Dr. Martin Leclerc",
      status: 'completed',
      description: "Formation obligatoire sur les règles de sécurité"
    },
    {
      id: 2,
      trainingName: "Formation Excel avancé",
      date: "2024-06-20",
      time: "14:00 - 17:00",
      location: "Salle informatique",
      instructor: "Sophie Dubois",
      status: 'scheduled',
      description: "Maîtrise des fonctions avancées d'Excel"
    },
    {
      id: 3,
      trainingName: "Management d'équipe",
      date: "2024-06-10",
      time: "09:00 - 16:00",
      location: "Salle de conférence",
      instructor: "Pierre Moreau",
      status: 'in_progress',
      description: "Techniques de management et leadership"
    }
  ];

  const handleSendCode = () => {
    if (!email.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive",
      });
      return;
    }

    // Simuler l'envoi d'un code par email
    console.log("Code envoyé à:", email);
    toast({
      title: "Code envoyé",
      description: "Un code de vérification a été envoyé à votre adresse email.",
    });
    setStep('code');
  };

  const handleVerifyCode = () => {
    if (!code.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le code de vérification.",
        variant: "destructive",
      });
      return;
    }

    // Simuler la vérification du code
    const validCodes = ["123456", "654321", "111111"];
    if (validCodes.includes(code)) {
      setEmployee(mockEmployee);
      setSessions(mockSessions);
      setStep('dashboard');
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace personnel.",
      });
    } else {
      toast({
        title: "Code incorrect",
        description: "Le code saisi n'est pas valide. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (status: Session['status']) => {
    const variants = {
      scheduled: { variant: "default" as const, label: "Programmée", color: "bg-blue-100 text-blue-800" },
      completed: { variant: "secondary" as const, label: "Terminée", color: "bg-green-100 text-green-800" },
      in_progress: { variant: "outline" as const, label: "En cours", color: "bg-orange-100 text-orange-800" }
    };
    
    const config = variants[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (step === 'email') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Espace Étudiant</CardTitle>
            <CardDescription>
              Accédez à vos formations et sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@company.com"
              />
            </div>

            <Button 
              onClick={handleSendCode} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!email.trim()}
            >
              Recevoir le code de vérification
            </Button>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              Un code de vérification sera envoyé à votre adresse email professionnelle.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'code') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Vérification</CardTitle>
            <CardDescription>
              Saisissez le code reçu par email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Key className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Code envoyé à <strong>{email}</strong>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="text-center text-lg tracking-wider"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('email')}
                className="flex-1"
              >
                Retour
              </Button>
              <Button 
                onClick={handleVerifyCode} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!code.trim()}
              >
                Vérifier
              </Button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              <strong>Codes de test :</strong> 123456, 654321, 111111
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with employee info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                  {getInitials(employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  Bienvenue, {employee.firstName} {employee.lastName}
                </CardTitle>
                <CardDescription className="text-base">
                  {employee.position} - {employee.department}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{employee.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Mes formations
            </CardTitle>
            <CardDescription>
              Toutes vos sessions de formation passées et à venir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formation</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Formateur</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{session.trainingName}</div>
                        <div className="text-sm text-gray-600">{session.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {session.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {session.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {session.location}
                      </div>
                    </TableCell>
                    <TableCell>{session.instructor}</TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => {
              setStep('email');
              setEmail("");
              setCode("");
              setEmployee(null);
              setSessions([]);
            }}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentSpace;
