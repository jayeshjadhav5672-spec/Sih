import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Welcome, Student!</CardTitle>
          <CardDescription>This is your student dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Here you can view your courses, grades, and upcoming deadlines.</p>
        </CardContent>
        <CardFooter className="justify-center">
           <Button asChild variant="outline">
              <Link href="/">Logout</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
