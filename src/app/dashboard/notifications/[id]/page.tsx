
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, GraduationCap, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { initialSubstitutions } from '@/lib/substitutions-data';
import { useState, useEffect } from 'react';
import type { SubstitutionRequest } from '@/lib/substitutions-data';

export default function SubstitutionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [substitution, setSubstitution] = useState<SubstitutionRequest | null>(null);

  useEffect(() => {
    const sub = initialSubstitutions.find((s) => s.id === id);
    if (sub) {
      setSubstitution(sub);
    }
  }, [id]);

  if (!substitution) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleDecline = () => {
    console.log('Declined substitution:', id);
    router.back();
  };

  const handleAccept = () => {
    console.log('Accepted substitution:', id);
    router.back();
  };
  
  const formattedDate = new Date(substitution.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Substitution Request</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Class Details</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Subject</p>
                <p className="font-bold text-lg">{substitution.subject}</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Class</p>
                <p className="font-bold text-lg">Grade {substitution.class.replace(/\D/g, '')}</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-bold text-lg">{formattedDate}</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Time Slot</p>
                <p className="font-bold text-lg">{substitution.time}</p>
              </div>
            </div>
          </div>
        </div>
        
        {substitution.notes && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Additional Notes</h2>
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground">{substitution.notes}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 bg-background p-4 border-t">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg" onClick={handleDecline}>Decline</Button>
          <Button size="lg" onClick={handleAccept}>Accept</Button>
        </div>
      </footer>
    </div>
  );
}
