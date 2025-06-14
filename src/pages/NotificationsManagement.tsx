
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Plus, Send, Clock, CheckCircle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface NotificationTemplate {
  id: number;
  name: string;
  type: "email" | "sms";
  subject: string;
  content: string;
  triggerType: "session_reminder" | "application_reminder" | "completion_request" | "feedback_request";
  active: boolean;
}

interface NotificationHistory {
  id: number;
  type: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: "sent" | "failed" | "pending";
}

const NotificationsManagement = () => {
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 1,
      name: "Rappel session J-3",
      type: "email",
      subject: "Rappel : Formation {trainingName} dans 3 jours",
      content: "Bonjour {employeeName},\n\nNous vous rappelons que vous êtes inscrit(e) à la formation \"{trainingName}\" qui aura lieu le {date} à {time} en salle {location}.\n\nMerci de confirmer votre présence.",
      triggerType: "session_reminder",
      active: true,
    },
    {
      id: 2,
      name: "Relance candidature",
      type: "email",
      subject: "Relance : Inscription formation {trainingName}",
      content: "Bonjour {employeeName},\n\nVotre candidature pour la formation \"{trainingName}\" est en attente de validation. La date limite d'inscription est le {deadline}.\n\nMerci de confirmer votre participation.",
      triggerType: "application_reminder",
      active: true,
    },
  ]);

  const [history, setHistory] = useState<NotificationHistory[]>([
    {
      id: 1,
      type: "Email",
      recipient: "jean.martin@company.com",
      subject: "Rappel : Formation Sécurité dans 3 jours",
      sentAt: "2024-01-15 09:30",
      status: "sent",
    },
    {
      id: 2,
      type: "SMS",
      recipient: "+33612345678",
      subject: "Rappel formation demain 14h",
      sentAt: "2024-01-14 18:00",
      status: "sent",
    },
  ]);

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "email" as "email" | "sms",
    subject: "",
    content: "",
    triggerType: "session_reminder" as NotificationTemplate['triggerType'],
  });

  const addTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const template: NotificationTemplate = {
      id: templates.length + 1,
      ...newTemplate,
      active: true,
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: "",
      type: "email",
      subject: "",
      content: "",
      triggerType: "session_reminder",
    });
    setIsTemplateDialogOpen(false);

    toast({
      title: "Succès",
      description: "Modèle de notification créé avec succès.",
    });
  };

  const toggleTemplate = (id: number) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, active: !template.active } : template
    ));
  };

  const sendTestNotification = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      toast({
        title: "Test envoyé",
        description: `Notification test envoyée avec le modèle "${template.name}".`,
      });
    }
  };

  const getStatusBadge = (status: NotificationHistory['status']) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Envoyé</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTriggerTypeBadge = (type: NotificationTemplate['triggerType']) => {
    switch (type) {
      case 'session_reminder':
        return <Badge variant="outline">Rappel session</Badge>;
      case 'application_reminder':
        return <Badge variant="outline">Relance candidature</Badge>;
      case 'completion_request':
        return <Badge variant="outline">Demande d'évaluation</Badge>;
      case 'feedback_request':
        return <Badge variant="outline">Demande d'avis</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications & Rappels</h1>
                <p className="text-gray-600">Gestion des alertes et communications automatiques</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Tabs defaultValue="templates" className="space-y-6">
              <TabsList>
                <TabsTrigger value="templates">Modèles</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          Modèles de notifications
                        </CardTitle>
                        <CardDescription>Créer et gérer les modèles d'e-mails et SMS automatiques</CardDescription>
                      </div>
                      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau modèle
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Nouveau modèle de notification</DialogTitle>
                            <DialogDescription>Créez un nouveau modèle pour les notifications automatiques</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="templateName">Nom du modèle *</Label>
                                <Input
                                  id="templateName"
                                  value={newTemplate.name}
                                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                  placeholder="Ex: Rappel session J-3"
                                />
                              </div>
                              <div>
                                <Label htmlFor="templateType">Type *</Label>
                                <Select value={newTemplate.type} onValueChange={(value: "email" | "sms") => setNewTemplate({ ...newTemplate, type: value })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="email">E-mail</SelectItem>
                                    <SelectItem value="sms">SMS</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="triggerType">Déclencheur *</Label>
                              <Select value={newTemplate.triggerType} onValueChange={(value: NotificationTemplate['triggerType']) => setNewTemplate({ ...newTemplate, triggerType: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="session_reminder">Rappel de session</SelectItem>
                                  <SelectItem value="application_reminder">Relance candidature</SelectItem>
                                  <SelectItem value="completion_request">Demande d'évaluation</SelectItem>
                                  <SelectItem value="feedback_request">Demande d'avis</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {newTemplate.type === "email" && (
                              <div>
                                <Label htmlFor="templateSubject">Objet *</Label>
                                <Input
                                  id="templateSubject"
                                  value={newTemplate.subject}
                                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                                  placeholder="Ex: Rappel : Formation dans 3 jours"
                                />
                              </div>
                            )}
                            <div>
                              <Label htmlFor="templateContent">Contenu *</Label>
                              <Textarea
                                id="templateContent"
                                value={newTemplate.content}
                                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                placeholder="Variables disponibles: {employeeName}, {trainingName}, {date}, {time}, {location}"
                                rows={6}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>Annuler</Button>
                              <Button onClick={addTemplate}>Créer</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Déclencheur</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell>
                              <Badge variant={template.type === "email" ? "default" : "secondary"}>
                                {template.type === "email" ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                                {template.type === "email" ? "E-mail" : "SMS"}
                              </Badge>
                            </TableCell>
                            <TableCell>{getTriggerTypeBadge(template.triggerType)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={template.active}
                                  onCheckedChange={() => toggleTemplate(template.id)}
                                />
                                <span className="text-sm">{template.active ? "Actif" : "Inactif"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => sendTestNotification(template.id)}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Test
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Historique des notifications
                    </CardTitle>
                    <CardDescription>Suivi de toutes les notifications envoyées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-6">
                      <Input placeholder="Rechercher par destinataire..." className="max-w-sm" />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Destinataire</TableHead>
                          <TableHead>Objet/Contenu</TableHead>
                          <TableHead>Envoyé le</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Badge variant={item.type === "Email" ? "default" : "secondary"}>
                                {item.type === "Email" ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                                {item.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.recipient}</TableCell>
                            <TableCell className="max-w-xs truncate">{item.subject}</TableCell>
                            <TableCell>{item.sentAt}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Paramètres de notification
                    </CardTitle>
                    <CardDescription>Configuration des délais et fréquences d'envoi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Rappels de session</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Rappel J-7</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Rappel J-3</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Rappel J-1</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Relances candidatures</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Relance après 3 jours</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Relance finale J-2</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Configuration SMTP</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="smtpServer">Serveur SMTP</Label>
                          <Input id="smtpServer" placeholder="smtp.company.com" />
                        </div>
                        <div>
                          <Label htmlFor="smtpPort">Port</Label>
                          <Input id="smtpPort" placeholder="587" />
                        </div>
                        <div>
                          <Label htmlFor="smtpUser">Utilisateur</Label>
                          <Input id="smtpUser" placeholder="noreply@company.com" />
                        </div>
                        <div>
                          <Label htmlFor="smtpPassword">Mot de passe</Label>
                          <Input id="smtpPassword" type="password" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>Sauvegarder les paramètres</Button>
                    </div>
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

export default NotificationsManagement;
