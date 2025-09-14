
'use client';

import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { signupUser as signupUserAction } from '@/app/actions';
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });
  
  const [state, formAction] = useActionState(signupUserAction, null);

  useEffect(() => {
    if (state?.success) {
      const values = form.getValues();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === values.email);

      if (existingUser) {
        form.setError('email', { type: 'server', message: 'An account with this email already exists.' });
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        ...values,
        profileImage: `https://i.pravatar.cc/150?u=${values.email}`,
        phone: '',
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
      profileData[newUser.id] = {
        name: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        role: newUser.role,
        id: newUser.id,
        subjects: newUser.role === 'teacher' ? ['Mathematics', 'Physics'] : [],
        wallpapers: JSON.parse(localStorage.getItem('divisionalWallpapers') || '[]')
      };
      localStorage.setItem('profileData', JSON.stringify(profileData));

      toast({ title: 'Success!', description: 'Signup successful! Please log in.' });
      router.push('/?message=Signup successful! Please log in.');
    } else if (state?.error && state.errors?.password) {
        form.setError('password', { type: 'server', message: state.errors.password[0] });
    } else if (state?.error && !state.errors) {
        toast({
            title: "Signup Almost Complete!",
            description: "Your account was created, but we couldn't verify password strength. Please log in.",
            variant: "default"
        });
        router.push('/?message=Signup successful! Please log in.');
    }
  }, [state, form, router, toast]);

  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
        <CardDescription className="pt-2">Join TimeWise today!</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form action={formAction} className="space-y-6">
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
            <SubmitButton />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
