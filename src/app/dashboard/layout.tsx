
'use client';
import Link from 'next/link';
import {
  CalendarDays,
  Bell,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t z-10">
        <nav className="flex justify-around items-center h-16">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center hover:text-primary ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <CalendarDays className="h-6 w-6" />
            <span className="text-xs font-medium">My Timetable</span>
          </Link>
          <Link
            href="/dashboard/notifications"
            className={`flex flex-col items-center hover:text-primary ${pathname === '/dashboard/notifications' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs">Notifications</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex flex-col items-center hover:text-primary ${pathname === '/dashboard/profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
