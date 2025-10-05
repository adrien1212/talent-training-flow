import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, CheckCircle, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Training {
  id: number;
  name: string;
}

interface RoadmapStep {
  id?: number;
  stepNumber: number;
  name: string;
  description: string;
  trainingIds: number[];
  completed?: boolean;
}

interface Roadmap {
  id: number;
  name: string;
  description: string;
  steps: RoadmapStep[];
  enrolledEmployees: number;
}

const Roadmaps = () => {
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
    {
      id: 1,
      name: "Developer Onboarding",
      description: "Complete training path for new developers",
      enrolledEmployees: 12,
      steps: [
        {
          id: 1,
          stepNumber: 1,
          name: "Foundation",
          description: "Basic programming concepts",
          trainingIds: [1, 2],
          completed: true,
        },
        {
          id: 2,
          stepNumber: 2,
          name: "Advanced Techniques",
          description: "Advanced development practices",
          trainingIds: [3],
          completed: false,
        },
      ],
    },
  ]);

  const [availableTrainings] = useState<Training[]>([
    { id: 1, name: "React Basics" },
    { id: 2, name: "TypeScript Fundamentals" },
    { id: 3, name: "Advanced React Patterns" },
    { id: 4, name: "API Design" },
    { id: 5, name: "Database Management" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [currentStep, setCurrentStep] = useState<Partial<RoadmapStep>>({
    name: "",
    description: "",
    trainingIds: [],
    stepNumber: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoadmap) {
      setRoadmaps(roadmaps.map(r => 
        r.id === editingRoadmap.id 
          ? { 
              ...r, 
              ...formData, 
              steps: steps.map((step, index) => ({
                ...step,
                id: step.id || Date.now() + index,
                stepNumber: index + 1,
              }))
            }
          : r
      ));
      toast({
        title: "Roadmap updated",
        description: "The roadmap has been updated successfully.",
      });
    } else {
      const newRoadmap: Roadmap = {
        id: Date.now(),
        ...formData,
        enrolledEmployees: 0,
        steps: steps.map((step, index) => ({
          ...step,
          id: Date.now() + index,
          stepNumber: index + 1,
        })),
      };
      setRoadmaps([...roadmaps, newRoadmap]);
      toast({
        title: "Roadmap created",
        description: "The new roadmap has been created successfully.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSteps([]);
    setCurrentStep({ name: "", description: "", trainingIds: [] });
    setEditingRoadmap(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (roadmap: Roadmap) => {
    setEditingRoadmap(roadmap);
    setFormData({ name: roadmap.name, description: roadmap.description });
    setSteps(roadmap.steps);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setRoadmaps(roadmaps.filter(r => r.id !== id));
    toast({
      title: "Roadmap deleted",
      description: "The roadmap has been deleted successfully.",
    });
  };

  const addStep = () => {
    if (currentStep.name && currentStep.trainingIds && currentStep.trainingIds.length > 0) {
      const newStep: RoadmapStep = {
        name: currentStep.name,
        description: currentStep.description || "",
        trainingIds: currentStep.trainingIds,
        stepNumber: steps.length + 1,
      };
      setSteps([...steps, newStep]);
      setCurrentStep({ name: "", description: "", trainingIds: [], stepNumber: 0 });
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const toggleTraining = (trainingId: number) => {
    const currentIds = currentStep.trainingIds || [];
    setCurrentStep({
      ...currentStep,
      trainingIds: currentIds.includes(trainingId)
        ? currentIds.filter(id => id !== trainingId)
        : [...currentIds, trainingId],
    });
  };

  const getTrainingName = (id: number) => {
    return availableTrainings.find(t => t.id === id)?.name || "Unknown";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Roadmaps</h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage training roadmaps for your employees
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingRoadmap(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Roadmap
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRoadmap ? "Edit Roadmap" : "Create New Roadmap"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Steps</h3>
                      
                      {steps.map((step, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Step {index + 1}</Badge>
                                  <h4 className="font-medium">{step.name}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {step.trainingIds.map(id => (
                                    <Badge key={id} variant="outline">
                                      {getTrainingName(id)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeStep(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Add New Step</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Step Name</label>
                            <Input
                              value={currentStep.name}
                              onChange={(e) => setCurrentStep({ ...currentStep, name: e.target.value })}
                              placeholder="e.g., Foundation"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={currentStep.description}
                              onChange={(e) => setCurrentStep({ ...currentStep, description: e.target.value })}
                              placeholder="Describe this step"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Select Trainings</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {availableTrainings.map(training => (
                                <Button
                                  key={training.id}
                                  type="button"
                                  variant={currentStep.trainingIds.includes(training.id) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleTraining(training.id)}
                                >
                                  {training.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={addStep}
                            disabled={!currentStep.name || !currentStep.trainingIds || currentStep.trainingIds.length === 0}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Step
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={steps.length === 0}>
                        {editingRoadmap ? "Update" : "Create"} Roadmap
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {roadmaps.map((roadmap) => (
                <Card key={roadmap.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{roadmap.name}</CardTitle>
                        <CardDescription className="mt-1">{roadmap.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(roadmap)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(roadmap.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Enrolled Employees</span>
                        <Badge>{roadmap.enrolledEmployees}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Steps</h4>
                        {roadmap.steps.map((step) => (
                          <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg border">
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                            )}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  Step {step.stepNumber}
                                </Badge>
                                <span className="font-medium text-sm">{step.name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{step.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {step.trainingIds.map(id => (
                                  <Badge key={id} variant="outline" className="text-xs">
                                    {getTrainingName(id)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Roadmaps;
