'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/providers/auth-provider';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoginInput, RegisterInput, UserStatus } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});


export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const loginData: LoginInput = {
        email: values.email,
        password: values.password,
      };
      
      const { user } = await signIn(loginData);
      
      if (user && user.status === UserStatus.ACTIVE) {
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
    <section className="h-screen w-screen flex flex-col gap-10 items-center justify-center bg-slate-200 dark:bg-gradient-to-br from-slate-700 to-slate-900">
        <Card className="shadow-2xl rounded-2xl border-0 w-[90%] md:w-[500px] mx-auto px-4 py-8">
        <CardContent className="pt-4 ">

        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

           <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" className='w-full' {...field} />
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



            <div className="flex flex-col md:flex-row justify-end gap-2 pt-2">
              <Button 
              className='w-full'
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Please wait...' : 'Sign In'}
                </Button>
            </div>
          </form>
        </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className='text-center text-sm text-muted-foreground'> Don't have an account? <Link href="/auth/sign-up" className="text-primary">Sign Up</Link></p>
        </CardFooter>
        </Card>

        <div className='flex flex-col items-center justify-center gap-2'>
          <Logo />
        </div>
  </section>
  );
}
