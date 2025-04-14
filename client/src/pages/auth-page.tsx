import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Redirect } from 'wouter';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  username: z.string().email({ message: 'Neplatný email' }),
  password: z.string().min(6, { message: 'Heslo musí mít alespoň 6 znaků' }),
});

const registerSchema = z.object({
  username: z.string().email({ message: 'Neplatný email' }),
  password: z.string().min(6, { message: 'Heslo musí mít alespoň 6 znaků' }),
  displayName: z.string().min(2, { message: 'Zadejte své jméno' }),
  avatarInitials: z.string().max(2, { message: 'Maximálně 2 znaky' }).default(''),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      displayName: '',
      avatarInitials: '',
    },
  });

  const onLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  // Redirect if already logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-[100svh] grid grid-cols-1 md:grid-cols-2">
      {/* Mobile-only header for iPhone */}
      <div className="bg-primary text-white p-6 flex flex-col items-center md:hidden">
        <h1 className="text-3xl font-bold">Píchačka</h1>
        <p className="text-center text-sm mt-1">
          Sledování času, výdělků a rodinných financí
        </p>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold hidden md:block">Píchačka</CardTitle>
            <CardDescription className="hidden md:block">
              Přihlaste se ke svému účtu nebo si vytvořte nový
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                <TabsTrigger value="login" className="text-base">Přihlášení</TabsTrigger>
                <TabsTrigger value="register" className="text-base">Registrace</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="vas@email.cz" 
                              {...field} 
                              className="h-12 text-base px-4 rounded-xl"
                              type="email"
                              inputMode="email"
                              autoCapitalize="none"
                              autoCorrect="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Heslo</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••" 
                              {...field} 
                              className="h-12 text-base px-4 rounded-xl"
                              autoCapitalize="none"
                              autoCorrect="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base rounded-xl mt-2" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? 
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Přihlašování...
                        </span> : 
                        'Přihlásit se'
                      }
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500 mt-4 pt-2 border-t border-gray-100">
                      <p>Přihlašovací údaje pro demo účet:</p>
                      <p className="font-mono mt-1 text-base">demo@example.com / password</p>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="vas@email.cz" 
                              {...field} 
                              className="h-12 text-base px-4 rounded-xl"
                              type="email"
                              inputMode="email"
                              autoCapitalize="none"
                              autoCorrect="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Celé jméno</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Jan Novák" 
                              {...field} 
                              className="h-12 text-base px-4 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="avatarInitials"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Iniciály (max. 2 znaky)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="JN" 
                              maxLength={2} 
                              {...field} 
                              className="h-12 text-base px-4 rounded-xl"
                              onChange={(e) => {
                                field.onChange(e.target.value.toUpperCase().slice(0, 2));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Heslo</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••" 
                              {...field} 
                              className="h-12 text-base px-4 rounded-xl"
                              autoCapitalize="none"
                              autoCorrect="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base rounded-xl mt-2" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? 
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registruji...
                        </span> : 
                        'Registrovat se'
                      }
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Desktop only sidebar */}
      <div className="hidden md:flex bg-primary text-white flex-col justify-center p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Píchačka - Rodinné finance</h1>
          <p className="text-xl mb-6">
            Aplikace pro sledování pracovního času, výdělků a rodinných financí.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Sledování pracovního času různých aktivit</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Automatické výpočty výdělků a srážek</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Správa příjmů a výdajů v různých měnách</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Sledování a správa dluhů mezi partnery</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}