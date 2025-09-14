
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, GraduationCap, Calendar, Clock, Star, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubstitutionRequest } from '@/lib/substitutions-data';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SubstitutionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  
  const [substitution, setSubstitution] = useState<SubstitutionRequest | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      const allSubs: SubstitutionRequest[] = JSON.parse(localStorage.getItem('substitutions') || '[]');
      const sub = allSubs.find((s) => s.id === id);

      if (sub) {
        setSubstitution(sub);
      }
    } else {
      router.push('/');
    }
  }, [id, router]);

  if (!substitution) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleDecline = () => {
    toast({
        title: "Request Declined",
        description: "You have declined the substitution request.",
    });
    router.back();
  };

  const handleAccept = () => {
    if (!currentUser) return;
    
    const allSubs: SubstitutionRequest[] = JSON.parse(localStorage.getItem('substitutions') || '[]');
    const subIndex = allSubs.findIndex(s => s.id === id);
    if (subIndex !== -1) {
        allSubs[subIndex].status = 'Accepted';
        allSubs[subIndex].acceptedBy = currentUser.fullName; // Save the name of the acceptor
        
        localStorage.setItem('substitutions', JSON.stringify(allSubs));

        setSubstitution(allSubs[subIndex]); // Update local state to re-render page
        
        toast({
            title: "Request Accepted!",
            description: `You are now scheduled to substitute.`,
        });
    }

    router.push('/dashboard/notifications');
  };
  
  const handleCancelRequest = () => {
    const allSubs: SubstitutionRequest[] = JSON.parse(localStorage.getItem('substitutions') || '[]');
    const updatedSubs = allSubs.filter(s => s.id !== id);
    
    localStorage.setItem('substitutions', JSON.stringify(updatedSubs));

    toast({
      title: "Request Cancelled",
      description: "Your substitution request has been cancelled.",
    });

    router.push('/dashboard/notifications');
  };
  
  const isActionable = substitution.status === 'Pending' && currentUser?.id !== substitution.requesterId;
  const isCancellable = substitution.status === 'Pending' && currentUser?.id === substitution.requesterId;

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
        
        {substitution.status === 'Accepted' && (
            <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/40">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900">
                        <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300">Request Accepted</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">This substitution has been accepted by {substitution.acceptedBy}.</p>
                    </div>
                </CardContent>
            </Card>
        )}

        <div>
            <h2 className="text-2xl font-bold mb-2">Request Details</h2>
            <p className="text-muted-foreground mb-4">Requested by {substitution.requesterName}</p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Note from Teacher</h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground whitespace-pre-wrap">{substitution.notes}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {isActionable && currentUser?.role === 'teacher' && (
        <footer className="sticky bottom-0 bg-background p-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" onClick={handleDecline}>Decline</Button>
            <Button size="lg" onClick={handleAccept}>Accept</Button>
          </div>
        </footer>
       )}
       {isCancellable && (
          <footer className="sticky bottom-0 bg-background p-4 border-t">
            <Button variant="destructive" size="lg" className="w-full" onClick={handleCancelRequest}>Cancel Request</Button>
          </footer>
        )}
    </div>
  );
}
