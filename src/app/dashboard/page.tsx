
'use client';

import Image from "next/image";
import { useState } from "react";
import {
  Settings,
  Plus,
  ArrowUp,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AttendanceChart } from "@/components/attendance-chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialDivisions = [
  { id: "div-a", name: "Div A", imageId: "div-a-doodles-chalkboard-illustration" },
  { id: "div-b", name: "Div B", imageId: "div-b" },
  { id: "div-c", name: "Div C", imageId: "div-c" },
];

const faculty = [
  { name: "Ms. Evelyn Reed", subject: "Math", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { name: "Mr. Ethan Carter", subject: "Science", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
];

export default function DashboardPage() {
  const [divisions, setDivisions] = useState(initialDivisions);
  const [editingDivision, setEditingDivision] = useState<{ id: string; name: string; imageId: string} | null>(null);

  const handleEditDivision = (division: { id: string; name: string; imageId: string}) => {
    setEditingDivision(division);
  };

  const handleSaveDivision = () => {
    if (editingDivision) {
      setDivisions(divisions.map(d => d.id === editingDivision.id ? editingDivision : d));
      setEditingDivision(null);
    }
  };


  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Timetable</h1>
        <Button variant="ghost" size="icon">
          <Settings className="w-6 h-6" />
        </Button>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Divisional Timetables</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {divisions.map((division) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === division.imageId
            );
            return (
              <div key={division.id} className="flex-shrink-0 w-40">
                <Card className="overflow-hidden relative group">
                  <CardContent className="p-0">
                    {image && image.imageUrl && (
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={200}
                        height={120}
                        className="w-full h-auto object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog open={editingDivision?.id === division.id} onOpenChange={(isOpen) => !isOpen && setEditingDivision(null)}>
                      <DialogTrigger asChild>
                         <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 hover:bg-card" onClick={() => handleEditDivision(division)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Division</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input 
                              id="name" 
                              value={editingDivision?.name || ''} 
                              onChange={(e) => editingDivision && setEditingDivision({...editingDivision, name: e.target.value})} 
                              className="col-span-3" 
                            />
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                            <Input 
                              id="imageUrl" 
                              value={PlaceHolderImages.find(p => p.id === editingDivision?.imageId)?.imageUrl || ''} 
                              onChange={(e) => {
                                // This is a simplified example. In a real app you might want to handle image uploads or have a gallery.
                                // For now, we are creating a new placeholder image object if URL is changed.
                                if(editingDivision){
                                    const newImageId = `custom-${editingDivision.id}-${Date.now()}`;
                                    const newImage = {
                                        id: newImageId,
                                        description: "Custom Image",
                                        imageUrl: e.target.value,
                                        imageHint: "custom"
                                    };
                                    // This is a temporary solution for client side.
                                    // In real app, you would have a more robust way to manage images.
                                    if(!PlaceHolderImages.find(p => p.id === newImageId)){
                                       PlaceHolderImages.push(newImage);
                                    }
                                    setEditingDivision({...editingDivision, imageId: newImageId});
                                }
                              }} 
                              className="col-span-3" 
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                          </DialogClose>
                          <Button type="button" onClick={handleSaveDivision}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
                <p className="text-center mt-2 font-medium">{division.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Faculty Absences</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Assign Substitute
          </Button>
        </div>
        <div className="space-y-3">
          {faculty.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.subject}
                    </p>
                  </div>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-600 border-red-200">
                  Absent
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Analytics</h2>
        <Card>
          <CardHeader>
            <CardDescription>Attendance</CardDescription>
            <div className="flex items-baseline gap-2">
               <CardTitle className="text-4xl font-bold">92%</CardTitle>
               <div className="flex items-center text-sm text-green-500 font-medium">
                  <ArrowUp className="h-4 w-4" />
                  <span>2%</span>
                  <span className="text-muted-foreground ml-2">Last 7 Days</span>
               </div>
            </div>
          </CardHeader>
          <CardContent>
             <AttendanceChart />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
