
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'teacher', 'admin'], {
    required_error: 'Please select a role.',
  }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  );
}

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    form.clearErrors();

    // First check local storage if user exists to avoid unnecessary Firebase calls
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === values.email);
    if (existingUser) {
        form.setError('email', { type: 'manual', message: 'An account with this email already exists.' });
        setPending(false);
        return;
    }

    try {
        // Create user in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const firebaseUser = userCredential.user;

        // Save user to local storage for profile data
        const newUser = {
            id: firebaseUser.uid, // Use Firebase UID as the user ID
            fullName: values.fullName,
            email: values.email,
            role: values.role,
            // Don't store password in local storage
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Create profile data
        const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        profileData[newUser.id] = {
            name: newUser.fullName,
            email: newUser.email,
            phone: '',
            profileImage: `https://i.pravatar.cc/150?u=${newUser.email}`,
            role: newUser.role,
            id: newUser.id,
            subjects: newUser.role === 'teacher' ? ['Mathematics', 'Physics'] : [],
            wallpapers: JSON.parse(localStorage.getItem('divisionalWallpapers') || '[]')
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));

        toast({ title: 'Success!', description: 'Signup successful! Please log in.' });
        router.push('/?message=Signup successful! Please log in.');

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            form.setError('email', { type: 'manual', message: 'An account with this email already exists.' });
        } else if (error.code === 'auth/weak-password') {
            form.setError('password', { type: 'manual', message: 'Password is too weak. It must be at least 6 characters long.' });
        } else {
            toast({ title: "Signup Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
            console.error("Firebase signup error:", error);
        }
    } finally {
        setPending(false);
    }
  };


  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
        <CardDescription className="pt-2">Join TimeWise today!</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
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
                    <Input placeholder="name@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
