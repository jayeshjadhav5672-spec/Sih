
'use client';

import Image from "next/image";
import {
  Settings,
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
import { getStoredWallpapers, type ImagePlaceholder } from "@/lib/placeholder-images";
import { AttendanceChart } from "@/components/attendance-chart";
import { useEffect, useState } from "react";

const initialDivisions = [
  { id: "div-a", name: "Div A", imageId: "div-a-doodles-chalkboard" },
  { id: "div-b", name: "Div B", imageId: "div-b" },
  { id: "div-c", name: "Div C", imageId: "div-c" },
];

export default function DashboardPage() {
  const [wallpapers, setWallpapers] = useState<ImagePlaceholder[]>([]);

  useEffect(() => {
    // On component mount, we load the latest wallpapers, which might have been updated from the profile page.
    setWallpapers(getStoredWallpapers());

    const handleStorageChange = () => {
        setWallpapers(getStoredWallpapers());
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

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
          {initialDivisions.map((division) => {
            const image = wallpapers.find(
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
