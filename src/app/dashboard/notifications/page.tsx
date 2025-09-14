
'use client';

import { useState } from 'react';
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
import { initialSubstitutions, SubstitutionRequest } from '@/lib/substitutions-data';


export default function NotificationsPage() {
    const [substitutions, setSubstitutions] = useState<SubstitutionRequest[]>(initialSubstitutions);
    const [newRequest, setNewRequest] = useState({ subject: '', class: '', time: '', date: '', notes: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewRequest(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSendRequest = () => {
        if (newRequest.subject && newRequest.class && newRequest.time && newRequest.date) {
            const newSub: SubstitutionRequest = {
                id: `sub-${Date.now()}`,
                status: 'Pending',
                ...newRequest
            };
            setSubstitutions(prevSubs => [newSub, ...prevSubs]);
            // Here you would typically send the push notification
            console.log('Sending push notification for:', newSub);
            // Close dialog by resetting state or using DialogClose
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="icon">
              <Plus className="w-6 h-6" />
            </Button>
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
                <Textarea id="notes" name="notes" value={newRequest.notes} onChange={handleInputChange} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={handleSendRequest}>Send Request</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <main className="p-4 md:p-6 space-y-4">
        {substitutions.map((sub) => (
          <Card key={sub.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{sub.subject} - {sub.class}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${sub.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {sub.status}
                </span>
              </CardTitle>
              <CardDescription>
                {sub.date} at {sub.time}
              </CardDescription>
            </CardHeader>
            {sub.notes && (
                <CardContent>
                    <p className="text-sm text-muted-foreground">{sub.notes}</p>
                </CardContent>
            )}
          </Card>
        ))}
      </main>
    </div>
  );
}
