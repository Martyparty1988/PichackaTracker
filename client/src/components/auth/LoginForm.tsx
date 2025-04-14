import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthProvider";

const formSchema = z.object({
  username: z.string().min(1, "Email je povinný").email("Neplatný formát emailu"),
  password: z.string().min(1, "Heslo je povinné"),
  rememberMe: z.boolean().default(false),
});

export function LoginForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values.username, values.password, values.rememberMe);
    } catch (error) {
      toast({
        title: "Přihlášení selhalo",
        description: error instanceof Error ? error.message : "Nesprávné přihlašovací údaje, zkuste to znovu.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="w-full max-w-md p-6 rounded-2xl bg-white shadow-card slide-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <i className='bx bx-time text-white text-4xl'></i>
          </div>
        </div>
        <h1 className="text-3xl font-heading font-bold text-dark">Píchačka</h1>
        <p className="text-gray-500 mt-2">Přihlaste se ke sledování vaší pracovní doby</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="jmeno@email.cz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heslo</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center">
                  <Checkbox 
                    id="remember-me" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                    Zapamatovat si mě
                  </label>
                </div>
              )}
            />
            <a href="#" className="text-sm text-primary-dark hover:underline">Zapomenuté heslo?</a>
          </div>
          
          <Button type="submit" className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark">
            Přihlásit se
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Nemáte účet? <a href="#" className="text-primary-dark hover:underline">Registrovat se</a>
        </p>
      </div>
    </div>
  );
}
