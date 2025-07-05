'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/providers/auth-provider';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { RegisterInput } from '@/types';
import { SelectButtons } from '@/components/select-button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';


enum UserRole {
  ISV = 'ISV',
  BUYER = 'BUYER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  RESELLER = 'RESELLER'
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.nativeEnum(UserRole, { message: "Please select a valid role" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});


export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, isLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.ISV,
      password: '',
      confirmPassword: '',
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    debugger;
    setIsSubmitting(true);
    try {
      const registerData: RegisterInput = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      };
      debugger;
      
      const { user, subscription } = await signUp(registerData);
      
      if (user && subscription) {
        toast.success('User created successfully!');
        toast.loading('Redirecting to dashboard...', {
          duration: 2000,
          id: 'redirect'
        })
        setTimeout(() => {
          window.location.href = '/dashboard';
          toast.dismiss('redirect');
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'User creation failed. Please try again.');
    }
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center bg-slate-200 dark:bg-gradient-to-br from-slate-700 to-slate-900">
        <Card className="shadow-2xl rounded-2xl border-0  md:max-w-2xl mx-auto px-4 py-8">
        <CardContent className="pt-4 ">

        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           <SelectButtons
              control={form.control}
              name="role"
              label="User Role"
              options={UserRole}
              description="Categorize your user for easier organization"
              gridCols={{ default: 1, sm: 2, md: 3, lg: 4 }}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="********" className='w-full' type={showPassword ? 'text' : 'password'} {...field} />
                      <Button variant="ghost" type='button' size="icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="********" className='w-full' type={showPassword ? 'text' : 'password'} {...field} />
                      <Button variant="ghost" type='button' size="icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex flex-col md:flex-row justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Please wait...' : 'Create Account'}
                  </Button>
            </div>
          </form>
        </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
         <p className='text-center text-sm text-muted-foreground'> Already have an account? <Link href="/auth/sign-in" className="text-primary">Sign In</Link></p>
        </CardFooter>
        </Card>
  </section>
  );
}
