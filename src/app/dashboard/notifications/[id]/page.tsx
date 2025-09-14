
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
  const [isSubjectMatch, setIsSubjectMatch] = useState(false);
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
        
        const allProfileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        const userProfile = allProfileData[user.id];

        if (userProfile && userProfile.subjects?.includes(sub.subject)) {
          setIsSubjectMatch(true);
        }
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
            description: `You are now scheduled to substitute for ${allSubs[subIndex].subject}.`,
        });
    }

    router.push('/dashboard/notifications');
  };
  
  const isActionable = substitution.status === 'Pending' && currentUser?.id !== substitution.requesterName;

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
        {currentUser?.role === 'teacher' && isSubjectMatch && substitution.status === 'Pending' && (
            <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/40">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full dark:bg-green-900">
                        <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-green-800 dark:text-green-300">It's a Subject Match!</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">This request is for a subject you teach.</p>
                    </div>
                </CardContent>
            </Card>
        )}
        
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
          <h2 className="text-2xl font-bold mb-2">Class Details</h2>
          <p className="text-muted-foreground mb-4">Requested by {substitution.requesterName}</p>
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

      {isActionable && currentUser?.role === 'teacher' && (
        <footer className="sticky bottom-0 bg-background p-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" onClick={handleDecline}>Decline</Button>
            <Button size="lg" onClick={handleAccept}>Accept</Button>
          </div>
        </footer>
       )}
    </div>
  );
}
