
'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { SubstitutionRequest } from '@/lib/substitutions-data';
import { useToast } from '@/hooks/use-toast';


export default function NotificationsPage() {
    const [substitutions, setSubstitutions] = useState<SubstitutionRequest[]>([]);
    const [note, setNote] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        const userStr = sessionStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
        }

        const storedSubstitutions = localStorage.getItem('substitutions');
        if (storedSubstitutions) {
            setSubstitutions(JSON.parse(storedSubstitutions).sort((a: any, b: any) => b.timestamp - a.timestamp));
        }
    }, []);

    const handleSendRequest = () => {
        if (note.trim()) {
            const newSub: SubstitutionRequest = {
                id: `sub-${Date.now()}`,
                timestamp: Date.now(),
                status: 'Pending',
                notes: note,
                requesterId: currentUser?.id,
                requesterName: currentUser?.fullName || 'A Teacher',
            };
            
            toast({
              title: "Request Sent",
              description: "Your substitution request has been sent to available teachers.",
            });
            
            setNote('');
            
            const updatedSubs = [newSub, ...substitutions];
            setSubstitutions(updatedSubs);
            localStorage.setItem('substitutions', JSON.stringify(updatedSubs));

            setIsDialogOpen(false);
        } else {
           toast({
              title: "Note is empty",
              description: "Please write a note for your substitution request.",
              variant: "destructive"
            });
        }
    };


  return (
    <div className="bg-background min-h-screen">
       <header className="flex items-center justify-between p-4 border-b">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Substitutions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             {currentUser?.role === 'teacher' && (
                <Button variant="default" size="icon" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-6 h-6" />
                </Button>
             )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Substitution Request</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="notes">Note to Faculty</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                placeholder="e.g. I won't be able to take the Physics lecture for Grade 12 at 10 AM. If you wish, you can take over the lecture." 
                value={note} 
                onChange={(e) => setNote(e.target.value)}
                className="col-span-3 min-h-[120px]" 
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSendRequest}>Send Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <main className="p-4 md:p-6 space-y-4 pb-20">
        {substitutions.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12">
            <p>No substitution requests yet.</p>
          </div>
        ) : (
          substitutions.map((sub) => (
            <Link href={`/dashboard/notifications/${sub.id}`} key={sub.id} passHref>
               <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <div className="flex-1">
                        <span>Request from {sub.requesterName}</span>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap ${sub.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {sub.status}
                      </span>
                    </CardTitle>
                     <CardDescription>
                      {new Date(sub.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground truncate">{sub.notes}</p>
                      {sub.status === 'Accepted' && sub.acceptedBy && (
                         <p className="text-sm text-green-600 font-semibold pt-2">Accepted by {sub.acceptedBy}</p>
                      )}
                  </CardContent>
                </Card>
            </Link>
          ))
        )}
      </main>
    </div>
  );
}
