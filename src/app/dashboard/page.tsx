
'use client';

import Image from "next/image";
import Link from "next/link";
import {
  Settings,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Check,
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const initialDivisions = [
  { id: "div-a", name: "Div A", imageId: "div-a-doodles-chalkboard" },
  { id: "div-b", name: "Div B", imageId: "div-b" },
  { id: "div-c", name: "Div C", imageId: "div-c" },
];

const initialChartData = [
  { name: "Mon", total: 0 },
  { name: "Tue", total: 0 },
  { name: "Wed", total: 0 },
  { name: "Thu", total: 0 },
  { name: "Fri", total: 0 },
];

type WeeklyAttendance = {
  [key: string]: { present: number; total: number };
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};


export default function DashboardPage() {
  const [wallpapers, setWallpapers] = useState<ImagePlaceholder[]>([]);
  const [attendance, setAttendance] = useState(0);
  const [attendanceChange, setAttendanceChange] = useState(0);
  const [chartData, setChartData] = useState(initialChartData);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    const allProfileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const userProfile = allProfileData[user.id];

    if (userProfile && userProfile.wallpapers) {
      setWallpapers(userProfile.wallpapers);
    } else {
      setWallpapers(getStoredWallpapers());
    }

    if (user.role === 'teacher') {
      updateAnalytics(user.id);
    }

  }, [router]);
  
  const updateAnalytics = (userId: string) => {
    const allAttendanceData = JSON.parse(localStorage.getItem('teacherAttendance') || '{}');
    const userAttendanceData = allAttendanceData[userId] || {};
    const today = new Date();
    const weekStart = getStartOfWeek(today).toISOString().split('T')[0];
    const currentWeekData: WeeklyAttendance = userAttendanceData[weekStart] || {};
    
    const dayMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let totalAttendance = 0;

    const newChartData = initialChartData.map(day => {
      const dayData = currentWeekData[day.name];
      if (dayData && dayData.total > 0) {
        const percentage = (dayData.present / dayData.total) * 100;
        totalAttendance += percentage;
        return { ...day, total: parseFloat(percentage.toFixed(1)) };
      }
      return day;
    });

    setChartData(newChartData);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDay = dayMapping[yesterday.getDay()];
    const todayDay = dayMapping[today.getDay()];

    const yesterdayAttendance = currentWeekData[yesterdayDay] ? (currentWeekData[yesterdayDay].present / currentWeekData[yesterdayDay].total) * 100 : 0;
    const todayAttendance = currentWeekData[todayDay] ? (currentWeekData[todayDay].present / currentWeekData[todayDay].total) * 100 : 0;
    
    setAttendance(todayAttendance || 0);
    
    if (yesterdayAttendance > 0) {
      const change = todayAttendance - yesterdayAttendance;
      setAttendanceChange(change);
    } else if (todayAttendance > 0) {
      setAttendanceChange(100);
    } else {
      setAttendanceChange(0);
    }
  };

  const handleMarkPresence = () => {
    if (!currentUser) return;

    const today = new Date();
    const dayMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayMapping[today.getDay()];

    if (dayName === "Sat" || dayName === "Sun") {
      toast({
        title: "It's the weekend!",
        description: "You can only mark presence on weekdays.",
        variant: "destructive"
      });
      return;
    }
    
    const allAttendanceData = JSON.parse(localStorage.getItem('teacherAttendance') || '{}');
    if (!allAttendanceData[currentUser.id]) {
        allAttendanceData[currentUser.id] = {};
    }
    const userAttendanceData = allAttendanceData[currentUser.id];

    const weekStart = getStartOfWeek(today).toISOString().split('T')[0];
    if (!userAttendanceData[weekStart]) {
      userAttendanceData[weekStart] = {};
    }

    if (!userAttendanceData[weekStart][dayName]) {
      userAttendanceData[weekStart][dayName] = { present: 0, total: 0 };
    }
    
    // Assuming a teacher has 5 lectures in a day
    const totalLectures = 5;
    const currentPresent = userAttendanceData[weekStart][dayName].present;
    
    if (currentPresent < totalLectures) {
      userAttendanceData[weekStart][dayName].present += 1;
    } else {
      toast({
        title: "Maximum Presence Marked",
        description: "You have already marked presence for all lectures today.",
      });
      return;
    }
    
    userAttendanceData[weekStart][dayName].total = totalLectures;

    localStorage.setItem('teacherAttendance', JSON.stringify(allAttendanceData));
    
    toast({
        title: "Presence Marked",
        description: `You have marked your presence for one lecture on ${dayName}.`
    });

    updateAnalytics(currentUser.id);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Timetable</h1>
        <Link href="/dashboard/profile" passHref>
          <Button variant="ghost" size="icon">
            <Settings className="w-6 h-6" />
          </Button>
        </Link>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/notifications" passHref>
          <Button className="w-full" size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Request Substitution
          </Button>
        </Link>
        {currentUser?.role === 'teacher' && (
          <Button className="w-full" size="lg" variant="secondary" onClick={handleMarkPresence}>
             <Check className="mr-2 h-5 w-5" />
             Mark My Presence
          </Button>
        )}
      </section>

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

      {currentUser?.role === 'teacher' && (
        <section>
          <h2 className="text-xl font-semibold mb-3">My Weekly Analytics</h2>
          <Card>
            <CardHeader>
              <CardDescription>Today's Presence</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-4xl font-bold">{attendance.toFixed(1)}%</CardTitle>
                <div className={`flex items-center text-sm font-medium ${attendanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {attendanceChange >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    <span>{Math.abs(attendanceChange).toFixed(1)}% vs yesterday</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AttendanceChart data={chartData} />
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
