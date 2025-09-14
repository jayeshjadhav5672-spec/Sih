import Link from "next/link";
import {
  CalendarDays,
  Grid3x3,
  LineChart,
  Settings,
  Users,
  User,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t z-10">
        <nav className="flex justify-around items-center h-16">
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-primary"
          >
            <Grid3x3 className="h-6 w-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center text-muted-foreground hover:text-primary"
          >
            <CalendarDays className="h-6 w-6" />
            <span className="text-xs">Timetables</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center text-muted-foreground hover:text-primary"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs">Faculty</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center text-muted-foreground hover:text-primary"
          >
            <LineChart className="h-6 w-6" />
            <span className="text-xs">Analytics</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center text-muted-foreground hover:text-primary"
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
