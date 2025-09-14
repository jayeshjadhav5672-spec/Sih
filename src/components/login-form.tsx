'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertTriangle, CheckCircle2, Loader2, User, Lock, School } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser as loginUserAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { collegeData } from '@/lib/college-data';
import { useRouter } from 'next/navigation';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Login
    </Button>
  );
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const signupMessage = searchParams.get('message');
  const [role, setRole] = useState('student');
  const [collegeName, setCollegeName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();

  const handleCollegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCollegeName(value);
    if (value.length > 1) {
      const filteredColleges = collegeData
        .filter((college) =>
          college.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredColleges);
      setIsPopoverOpen(filteredColleges.length > 0);
    } else {
      setSuggestions([]);
      setIsPopoverOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCollegeName(suggestion);
    setSuggestions([]);
    setIsPopoverOpen(false);
  };
  
  const handleLogin = (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      router.push('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="w-full max-w-md">
       <h1 className="text-2xl font-semibold text-center mb-8 text-foreground/80">Timetable App</h1>
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader className="text-left p-0 mb-6">
          <CardTitle className="text-4xl font-bold">Sign in to your account</CardTitle>
          <CardDescription className="pt-2">Welcome back! Please enter your details.</CardDescription>
        </CardHeader>
        <form action={handleLogin}>
          <CardContent className="space-y-4 p-0">
            {signupMessage && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{signupMessage}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
               <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="college" 
                        name="college" 
                        placeholder="College Name" 
                        type="text" 
                        required 
                        className="pl-10" 
                        value={collegeName}
                        onChange={handleCollegeChange}
                        autoComplete="off"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                     <div className="flex flex-col space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="justify-start font-normal"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" name="email" placeholder="Email or Username" type="email" required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="relative w-full">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" name="password" type="password" placeholder="Password" required className="pl-10" />
                </div>
              </div>
               <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
             <div className="space-y-2">
                <Label>Login as:</Label>
                <Tabs value={role} onValueChange={setRole} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted p-1 h-auto">
                        <TabsTrigger value="teacher" className={cn("text-muted-foreground data-[state=active]:bg-selection data-[state=active]:text-selection-foreground data-[state=active]:shadow-sm", role === 'teacher' && 'bg-selection text-selection-foreground shadow-sm')}>Teacher</TabsTrigger>
                        <TabsTrigger value="student" className={cn("text-muted-foreground data-[state=active]:bg-selection data-[state=active]:text-selection-foreground data-[state=active]:shadow-sm", role === 'student' && 'bg-selection text-selection-foreground shadow-sm')}>Student</TabsTrigger>
                        <TabsTrigger value="admin" className={cn("text-muted-foreground data-[state=active]:bg-selection data-[state=active]:text-selection-foreground data-[state=active]:shadow-sm", role === 'admin' && 'bg-selection text-selection-foreground shadow-sm')}>Admin</TabsTrigger>
                    </TabsList>
                </Tabs>
                <input type="hidden" name="role" value={role} />
            </div>
            <div className="pt-4">
                <LoginButton />
            </div>
             <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
