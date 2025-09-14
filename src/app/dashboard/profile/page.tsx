
'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Settings,
  LogOut,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logoutUser } from '@/app/actions';


export default function ProfilePage() {
    const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150?u=ethan-carter');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="relative mb-4">
            <Avatar className="w-32 h-32 border-4 border-card">
                <AvatarImage src={profileImage} alt="Ethan Carter" />
                <AvatarFallback>EC</AvatarFallback>
            </Avatar>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange}
                className="hidden" 
                accept="image/*"
            />
            <Button
                variant="default"
                size="icon"
                className="absolute bottom-1 right-1 rounded-full h-8 w-8 bg-primary text-primary-foreground"
                onClick={handleEditClick}
            >
                <Edit2 className="w-4 h-4" />
            </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Ethan Carter</h2>
          <p className="text-muted-foreground">Student</p>
          <p className="text-muted-foreground text-sm">ID: 123456</p>
        </div>

        <div className="w-full max-w-md space-y-3">
          <Card>
            <CardContent className="p-0">
                <button className="w-full">
                    <div className="flex items-center p-4">
                        <Mail className="w-5 h-5 mr-4 text-muted-foreground" />
                        <div className="flex-1 text-left">
                            <p className="font-semibold">Email</p>
                            <p className="text-sm text-muted-foreground">ethan.carter@example.com</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                </button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
                <button className="w-full">
                    <div className="flex items-center p-4">
                        <Phone className="w-5 h-5 mr-4 text-muted-foreground" />
                        <div className="flex-1 text-left">
                            <p className="font-semibold">Phone</p>
                            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                </button>
            </CardContent>
          </Card>

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