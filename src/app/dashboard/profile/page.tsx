
'use client';
import { useState, useRef, useEffect } from 'react';
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
  Edit,
  Trash2,
  Image as ImageIcon,
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
import { Separator } from '@/components/ui/separator';
import { getStoredWallpapers, type ImagePlaceholder } from '@/lib/placeholder-images';


export default function ProfilePage() {
    const { setTheme, theme } = useTheme();
    const [name, setName] = useState('Ethan Carter');
    const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150?u=ethan-carter');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const divAWallpaperInputRef = useRef<HTMLInputElement>(null);
    const divBWallpaperInputRef = useRef<HTMLInputElement>(null);
    const divCWallpaperInputRef = useRef<HTMLInputElement>(null);
    const [email, setEmail] = useState('ethan.carter@example.com');
    const [phone, setPhone] = useState('+1 (555) 123-4567');
    
    // This state will now hold the image data and be the source of truth
    const [wallpapers, setWallpapers] = useState<ImagePlaceholder[]>([]);

    useEffect(() => {
        // On component mount, we load the latest wallpapers.
        const storedWallpapers = getStoredWallpapers();
        setWallpapers(storedWallpapers);

        if (!localStorage.getItem('divisionalWallpapers')) {
            localStorage.setItem('divisionalWallpapers', JSON.stringify(storedWallpapers));
        }

        const handleStorageChange = () => {
            setWallpapers(getStoredWallpapers());
        };
        
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const saveWallpapers = (newWallpapers: ImagePlaceholder[]) => {
        setWallpapers(newWallpapers);
        try {
            // Persist changes to localStorage so they are not lost on refresh
            localStorage.setItem('divisionalWallpapers', JSON.stringify(newWallpapers));
            // Dispatch a storage event to notify other open tabs/windows
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Failed to save wallpapers to localStorage", error);
        }
    }

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

    const handleRemoveImage = () => {
        setProfileImage('');
    }
    
    const handleWallpaperChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if(event.target?.result) {
                   const newImageUrl = event.target.result as string;
                   const updatedWallpapers = wallpapers.map(wp => 
                       wp.id === id ? { ...wp, imageUrl: newImageUrl } : wp
                   );
                   saveWallpapers(updatedWallpapers);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
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
                    {profileImage && <AvatarImage src={profileImage} alt={name} />}
                    <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ImageIcon className="w-8 h-8 text-white" />
                </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle className="text-center">Change Profile Photo</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <Avatar className="w-40 h-40 border-4 border-card">
                {profileImage && <AvatarImage src={profileImage} alt={name} />}
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={handleUploadClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={handleRemoveImage}>
                   <Trash2 className="mr-2 h-4 w-4" />
                   Remove Photo
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange}
            className="hidden" 
            accept="image/*"
        />
         <input type="file" ref={divAWallpaperInputRef} onChange={handleWallpaperChange('div-a-doodles-chalkboard')} className="hidden" accept="image/*" />
         <input type="file" ref={divBWallpaperInputRef} onChange={handleWallpaperChange('div-b')} className="hidden" accept="image/*" />
         <input type="file" ref={divCWallpaperInputRef} onChange={handleWallpaperChange('div-c')} className="hidden" accept="image/*" />

        <div className="text-center mb-8">
            <Dialog>
                <DialogTrigger asChild>
                    <div className="flex items-center justify-center gap-2 cursor-pointer group">
                      <h2 className="text-2xl font-bold group-hover:underline">{name}</h2>
                      <Edit className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Name</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          <p className="text-muted-foreground">Teacher</p>
          <p className="text-muted-foreground text-sm">ID: 123456</p>
        </div>

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
                            <Label htmlFor="current-password" className="text-right">Current</Label>
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
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>App Settings</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div>
                             <h3 className="text-lg font-semibold mb-4">General</h3>
                             <div className="space-y-4">
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
                                    <Switch id="notifications" defaultChecked />
                                </div>
                             </div>
                        </div>

                        <Separator />
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Divisional Wallpapers</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Div A Wallpaper</Label>
                                    <Button variant="outline" onClick={() => divAWallpaperInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </Button>
                                </div>
                                 <div className="flex items-center justify-between">
                                    <Label>Div B Wallpaper</Label>
                                     <Button variant="outline" onClick={() => divBWallpaperInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </Button>
                                </div>
                                 <div className="flex items-center justify-between">
                                    <Label>Div C Wallpaper</Label>
                                     <Button variant="outline" onClick={() => divCWallpaperInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Done</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button">Save</Button>
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
