
'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Settings,
  LogOut,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logoutUser } from '@/app/actions';
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
import { Switch } from '@/components/ui/switch';


export default function ProfilePage() {
    const { setTheme, theme } = useTheme();
    const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150?u=ethan-carter');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [email, setEmail] = useState('ethan.carter@example.com');
    const [phone, setPhone] = useState('+1 (555) 123-4567');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if(event.target?.result) {
                    setProfileImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

  return (
    <div className="bg-background min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Profile</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-4 md:p-6 flex flex-col items-center">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative mb-4 cursor-pointer">
                <Avatar className="w-32 h-32 border-4 border-card">
                    <AvatarImage src={profileImage} alt="Ethan Carter" />
                    <AvatarFallback>EC</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                  <p className="text-white text-sm font-semibold">View Image</p>
                </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-md w-auto p-0">
            <Image src={profileImage} alt="Profile Image" width={500} height={500} className="rounded-lg" />
          </DialogContent>
        </Dialog>
        
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange}
            className="hidden" 
            accept="image/*"
        />

        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold">Ethan Carter</h2>
          <p className="text-muted-foreground">Student</p>
          <p className="text-muted-foreground text-sm">ID: 123456</p>
        </div>

        <Button onClick={handleEditClick} variant="outline" className="mb-8">
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
        </Button>

        <div className="w-full max-w-md space-y-3">
            {/* Email Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Card>
                        <CardContent className="p-0">
                            <button className="w-full">
                                <div className="flex items-center p-4">
                                    <Mail className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold">Email</p>
                                        <p className="text-sm text-muted-foreground">{email}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Email</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Phone Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Card>
                        <CardContent className="p-0">
                            <button className="w-full">
                                <div className="flex items-center p-4">
                                    <Phone className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold">Phone</p>
                                        <p className="text-sm text-muted-foreground">{phone}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Phone Number</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Card>
                        <CardContent className="p-0">
                            <button className="w-full">
                                <div className="flex items-center p-4">
                                    <Lock className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold">Change Password</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="current-password" cla ssName="text-right">Current</Label>
                            <Input id="current-password" type="password" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-password" className="text-right">New</Label>
                            <Input id="new-password" type="password" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirm-password" className="text-right">Confirm</Label>
                            <Input id="confirm-password" type="password" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button">Save Changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* App Settings Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Card>
                        <CardContent className="p-0">
                            <button className="w-full">
                                <div className="flex items-center p-4">
                                    <Settings className="w-5 h-5 mr-4 text-muted-foreground" />
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold">App Settings</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>App Settings</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <Switch 
                                id="dark-mode" 
                                checked={theme === 'dark'}
                                onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notifications">Enable Notifications</Label>
                            <Switch id="notifications" checked />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button">Done</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          
          <form action={logoutUser} className="w-full">
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30">
                <CardContent className="p-0">
                    <button type="submit" className="w-full">
                        <div className="flex items-center p-4 text-red-600 dark:text-red-400">
                            <LogOut className="w-5 h-5 mr-4" />
                            <div className="flex-1 text-left">
                                <p className="font-semibold">Logout</p>
                            </div>
                        </div>
                    </button>
                </CardContent>
            </Card>
          </form>

        </div>
      </main>
    </div>
  );
}
