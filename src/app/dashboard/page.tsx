
'use client';

import Image from "next/image";
import {
  Settings,
  Plus,
  ArrowUp,
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

const divisions = [
  { id: "div-a", name: "Div A", imageId: "div-a-doodles-chalkboard-illustration" },
  { id: "div-b", name: "Div B", imageId: "div-b" },
  { id: "div-c", name: "Div C", imageId: "div-c" },
];

const faculty = [
  { name: "Ms. Evelyn Reed", subject: "Math", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { name: "Mr. Ethan Carter", subject: "Science", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
];

export default function DashboardPage() {
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
                <Card className="overflow-hidden">
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
