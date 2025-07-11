
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
        navigate("/");
      } else {
        const errorData = await response.json();
        toast({
          title: "Erreur d'inscription",
          description: errorData.message || "Une erreur est survenue lors de l'inscription.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Créer votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Commencez à gérer vos formations dès aujourd'hui
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Remplissez les informations ci-dessous pour créer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: "Le prénom est requis" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{ required: "Le nom est requis" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  rules={{ 
                    required: "L'email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Adresse email invalide"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jean.dupont@entreprise.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{ 
                    required: "Le mot de passe est requis",
                    minLength: {
                      value: 8,
                      message: "Le mot de passe doit contenir au moins 8 caractères"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  rules={{ required: "Le nom de l'entreprise est requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon Entreprise SARL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Inscription en cours..." : "Créer mon compte"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
