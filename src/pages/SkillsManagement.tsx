
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Target, TrendingUp, Plus, Users, BookOpen } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  targetLevel: number;
  description: string;
}

interface EmployeeSkill {
  employeeId: number;
  employeeName: string;
  skills: { skillId: number; currentLevel: number; targetLevel: number; }[];
}

const SkillsManagement = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: "Sécurité industrielle", category: "Sécurité", level: 3, targetLevel: 4, description: "Maîtrise des protocoles de sécurité" },
    { id: 2, name: "Maintenance préventive", category: "Technique", level: 2, targetLevel: 4, description: "Planification et exécution de la maintenance" },
    { id: 3, name: "Management d'équipe", category: "Management", level: 1, targetLevel: 3, description: "Leadership et gestion d'équipe" },
  ]);

  const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkill[]>([
    { 
      employeeId: 1, 
      employeeName: "Jean Martin", 
      skills: [
        { skillId: 1, currentLevel: 3, targetLevel: 4 },
        { skillId: 2, currentLevel: 2, targetLevel: 4 }
      ]
    },
    { 
      employeeId: 2, 
      employeeName: "Marie Dubois", 
      skills: [
        { skillId: 1, currentLevel: 4, targetLevel: 4 },
        { skillId: 3, currentLevel: 1, targetLevel: 3 }
      ]
    },
  ]);

  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "", description: "" });

  const skillCategories = ["Sécurité", "Technique", "Management", "Informatique", "Commercial"];

  const addSkill = () => {
    if (!newSkill.name || !newSkill.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const skill: Skill = {
      id: skills.length + 1,
      name: newSkill.name,
      category: newSkill.category,
      level: 1,
      targetLevel: 3,
      description: newSkill.description,
    };

    setSkills([...skills, skill]);
    setNewSkill({ name: "", category: "", description: "" });
    setIsAddSkillDialogOpen(false);

    toast({
      title: "Succès",
      description: "Compétence ajoutée avec succès.",
    });
  };

  const getSkillGap = (currentLevel: number, targetLevel: number) => {
    return targetLevel - currentLevel;
  };

  const getGapColor = (gap: number) => {
    if (gap === 0) return "text-green-600";
    if (gap <= 1) return "text-yellow-600";
    return "text-red-600";
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
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Compétences & GPEC</h1>
                <p className="text-gray-600">Référentiel et cartographie des compétences</p>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Tabs defaultValue="referentiel" className="space-y-6">
              <TabsList>
                <TabsTrigger value="referentiel">Référentiel</TabsTrigger>
                <TabsTrigger value="cartographie">Cartographie</TabsTrigger>
                <TabsTrigger value="ecarts">Analyse des écarts</TabsTrigger>
                <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
              </TabsList>

              <TabsContent value="referentiel" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          Référentiel de compétences
                        </CardTitle>
                        <CardDescription>Définition et gestion des compétences métier</CardDescription>
                      </div>
                      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une compétence
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nouvelle compétence</DialogTitle>
                            <DialogDescription>Ajoutez une nouvelle compétence au référentiel</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="skillName">Nom de la compétence *</Label>
                              <Input
                                id="skillName"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                placeholder="Ex: Sécurité industrielle"
                              />
                            </div>
                            <div>
                              <Label htmlFor="skillCategory">Catégorie *</Label>
                              <Select value={newSkill.category} onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                  {skillCategories.map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="skillDescription">Description</Label>
                              <Textarea
                                id="skillDescription"
                                value={newSkill.description}
                                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                                placeholder="Description de la compétence..."
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsAddSkillDialogOpen(false)}>Annuler</Button>
                              <Button onClick={addSkill}>Ajouter</Button>
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
                          <TableHead>Compétence</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Niveau moyen actuel</TableHead>
                          <TableHead>Niveau cible</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {skills.map((skill) => (
                          <TableRow key={skill.id}>
                            <TableCell className="font-medium">{skill.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{skill.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={skill.level * 25} className="w-16" />
                                <span className="text-sm">{skill.level}/4</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={skill.targetLevel * 25} className="w-16" />
                                <span className="text-sm">{skill.targetLevel}/4</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{skill.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cartographie" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Cartographie des compétences
                    </CardTitle>
                    <CardDescription>Vue d'ensemble des niveaux actuels vs. cibles par employé</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {employeeSkills.map((employee) => (
                        <Card key={employee.employeeId} className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {employee.employeeName}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {employee.skills.map((employeeSkill) => {
                              const skill = skills.find(s => s.id === employeeSkill.skillId);
                              return skill ? (
                                <div key={employeeSkill.skillId} className="border rounded-lg p-3">
                                  <div className="font-medium text-sm mb-2">{skill.name}</div>
                                  <div className="space-y-2">
                                    <div>
                                      <div className="text-xs text-gray-600 mb-1">Niveau actuel</div>
                                      <Progress value={employeeSkill.currentLevel * 25} className="h-2" />
                                      <div className="text-xs mt-1">{employeeSkill.currentLevel}/4</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-600 mb-1">Niveau cible</div>
                                      <Progress value={employeeSkill.targetLevel * 25} className="h-2" />
                                      <div className="text-xs mt-1">{employeeSkill.targetLevel}/4</div>
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ecarts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Analyse des écarts de compétences
                    </CardTitle>
                    <CardDescription>Identification des besoins de formation prioritaires</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employé</TableHead>
                          <TableHead>Compétence</TableHead>
                          <TableHead>Niveau actuel</TableHead>
                          <TableHead>Niveau cible</TableHead>
                          <TableHead>Écart</TableHead>
                          <TableHead>Priorité</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeSkills.flatMap(employee =>
                          employee.skills.map(employeeSkill => {
                            const skill = skills.find(s => s.id === employeeSkill.skillId);
                            const gap = getSkillGap(employeeSkill.currentLevel, employeeSkill.targetLevel);
                            return skill ? (
                              <TableRow key={`${employee.employeeId}-${employeeSkill.skillId}`}>
                                <TableCell>{employee.employeeName}</TableCell>
                                <TableCell>{skill.name}</TableCell>
                                <TableCell>{employeeSkill.currentLevel}/4</TableCell>
                                <TableCell>{employeeSkill.targetLevel}/4</TableCell>
                                <TableCell className={getGapColor(gap)}>
                                  {gap > 0 ? `+${gap}` : gap === 0 ? "Objectif atteint" : gap}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={gap >= 2 ? "destructive" : gap >= 1 ? "default" : "secondary"}>
                                    {gap >= 2 ? "Haute" : gap >= 1 ? "Moyenne" : "Faible"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ) : null;
                          })
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommandations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Recommandations de formation
                    </CardTitle>
                    <CardDescription>Formations suggérées basées sur l'analyse des écarts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Card className="p-4 border-l-4 border-l-red-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-red-700">Formation prioritaire</h3>
                            <p className="text-sm text-gray-600 mt-1">Maintenance préventive - Niveau avancé</p>
                            <p className="text-sm mt-2">Recommandée pour : Jean Martin</p>
                            <p className="text-xs text-gray-500 mt-1">Écart de compétence : +2 niveaux</p>
                          </div>
                          <Badge variant="destructive">Haute priorité</Badge>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-yellow-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-yellow-700">Formation recommandée</h3>
                            <p className="text-sm text-gray-600 mt-1">Management d'équipe - Base</p>
                            <p className="text-sm mt-2">Recommandée pour : Marie Dubois</p>
                            <p className="text-xs text-gray-500 mt-1">Écart de compétence : +2 niveaux</p>
                          </div>
                          <Badge variant="default">Moyenne priorité</Badge>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-green-700">Formation d'amélioration</h3>
                            <p className="text-sm text-gray-600 mt-1">Sécurité industrielle - Perfectionnement</p>
                            <p className="text-sm mt-2">Recommandée pour : Jean Martin</p>
                            <p className="text-xs text-gray-500 mt-1">Écart de compétence : +1 niveau</p>
                          </div>
                          <Badge variant="secondary">Faible priorité</Badge>
                        </div>
                      </Card>
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

export default SkillsManagement;
