import Link from "next/link";
import {
  CalendarDays,
  Bell,
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
            className="flex flex-col items-center text-muted-foreground hover:text-primary"
          >
            <CalendarDays className="h-6 w-6" />
            <span className="text-xs font-medium">My Timetable</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center text-muted-foreground hover:text-primary"
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs">Notifications</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex flex-col items-center text-primary"
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}