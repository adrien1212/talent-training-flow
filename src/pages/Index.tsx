
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, GraduationCap, Calendar } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Employés",
      value: "248",
      description: "Actifs dans l'entreprise",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Départements",
      value: "12",
      description: "Départements actifs",
      icon: Building2,
      color: "text-green-600"
    },
    {
      title: "Formations",
      value: "34",
      description: "Formations disponibles",
      icon: GraduationCap,
      color: "text-purple-600"
    },
    {
      title: "Sessions",
      value: "89",
      description: "Sessions programmées",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const recentTrainings = [
    { id: 1, name: "Sécurité au travail", department: "Production", date: "2024-06-10", participants: 15 },
    { id: 2, name: "Management d'équipe", department: "RH", date: "2024-06-12", participants: 8 },
    { id: 3, name: "Formation Excel", department: "Comptabilité", date: "2024-06-15", participants: 12 }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
                  <p className="text-gray-600">Tableau de bord principal</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Trainings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Formations Récentes
                </CardTitle>
                <CardDescription>
                  Dernières formations programmées dans votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTrainings.map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{training.name}</h3>
                        <p className="text-sm text-gray-600">{training.department}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{training.date}</p>
                        <p className="text-xs text-gray-600">{training.participants} participants</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Voir toutes les formations
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>
                  Accès rapide aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                    <Building2 className="h-6 w-6" />
                    Nouveau Département
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                    <Users className="h-6 w-6" />
                    Ajouter Employé
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                    <GraduationCap className="h-6 w-6" />
                    Créer Formation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
