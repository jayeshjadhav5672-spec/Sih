
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { SubstitutionRequest } from '@/lib/substitutions-data';
import { useToast } from '@/hooks/use-toast';


export default function NotificationsPage() {
    const [substitutions, setSubstitutions] = useState<SubstitutionRequest[]>([]);
    const [newRequest, setNewRequest] = useState({ subject: '', class: '', time: '', date: '', notes: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        const userStr = sessionStorage.getItem('currentUser');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }

        const storedSubstitutions = localStorage.getItem('substitutions');
        if (storedSubstitutions) {
            setSubstitutions(JSON.parse(storedSubstitutions));
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewRequest(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSendRequest = () => {
        if (newRequest.subject && newRequest.class && newRequest.time && newRequest.date) {
            const newSub: SubstitutionRequest = {
                id: `sub-${Date.now()}`,
                status: 'Pending',
                ...newRequest,
                requesterName: currentUser?.fullName || 'A Teacher',
            };
            
            console.log('Sending push notification for:', newSub);

            toast({
              title: "Request Sent",
              description: "Your substitution request has been sent to available teachers.",
            });
            
            setNewRequest({ subject: '', class: '', time: '', date: '', notes: '' });
            
            const updatedSubs = [newSub, ...substitutions];
            setSubstitutions(updatedSubs);
            localStorage.setItem('substitutions', JSON.stringify(updatedSubs));

            setIsDialogOpen(false);
        } else {
           toast({
              title: "Incomplete Request",
              description: "Please fill out all the required fields.",
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">Subject</Label>
                <Input id="subject" name="subject" value={newRequest.subject} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">Class</Label>
                <Input id="class" name="class" value={newRequest.class} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input id="time" name="time" value={newRequest.time} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input id="date" name="date" type="date" value={newRequest.date} onChange={handleInputChange} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="e.g. Please cover chapter 5" value={newRequest.notes} onChange={handleInputChange} className="col-span-3" />
              </div>
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
                        <span>{sub.subject} - {sub.class}</span>
                        <p className="text-sm font-normal text-muted-foreground pt-1">
                          Requested by {sub.requesterName}
                        </p>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap ${sub.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {sub.status}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {new Date(sub.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {sub.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                      {sub.status === 'Accepted' && sub.acceptedBy && (
                         <p className="text-sm text-green-600 font-semibold">Accepted by {sub.acceptedBy}</p>
                      )}
                      {sub.notes && sub.status !== 'Accepted' && (
                          <p className="text-sm text-muted-foreground truncate">{sub.notes}</p>
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
