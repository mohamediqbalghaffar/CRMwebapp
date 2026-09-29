'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Building,
  DollarSign,
  Settings,
  Archive,
  RotateCcw,
  PackageSearch,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useAuth, Role } from '@/contexts/auth-context';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ActiveUsers } from './active-users';
import { mockDb } from '@/firebase/mock-store';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const allNavLinks = [
  { href: '/sales', label: 'فرۆشتنەکان', icon: ShoppingCart, roles: ['admin', 'data manager', 'salesman'] },
  { href: '/purchases', label: 'کڕینەکان', icon: Package, roles: ['admin', 'data manager'] },
  { href: '/stock', label: 'کۆگا', icon: Archive, roles: ['admin', 'data manager', 'salesman', 'program previewer'] },
  { href: '/products', label: 'ناوی کاڵاکان', icon: PackageSearch, roles: ['admin', 'data manager', 'program previewer'] },
  { href: '/customers', label: 'کڕیارەکان', icon: Users, roles: ['admin', 'data manager', 'salesman'] },
  { href: '/suppliers', label: 'دابینکەران', icon: Building, roles: ['admin', 'data manager'] },
  { href: '/expenses', label: 'خەرجییەکان', icon: DollarSign, roles: ['admin', 'data manager'] },
  { href: '/dashboard', label: 'داشبۆرد', icon: Home, roles: ['admin', 'data manager', 'salesman', 'program previewer'] },
];

const tutorialLink = { href: '/tutorial', label: 'ڕێبەری بەکارهێنان', icon: HelpCircle, roles: ['admin', 'data manager', 'salesman', 'program previewer'] };
const settingsLink = { href: '/settings', label: 'ڕێکخستنەکان', icon: Settings, roles: ['admin', 'data manager'] };

export function SidebarNav() {
  const pathname = usePathname();
  const { user, switchRole } = useAuth();
  const { toast } = useToast();

  const handleResetData = () => {
    mockDb.resetToDefault();
    toast({
      title: 'داتای دێمۆ نوێکرایەوە',
      description: 'هەموو داتاکان گەڕانەوە بۆ باری سەرەتایی دێمۆ.',
    });
  };

  const navLinks = allNavLinks.filter((link) => {
    if (!user) return false;
    const userRole = user.role.toLowerCase();

    if (!link.roles.includes(userRole)) {
      return false;
    }

    if (userRole === 'salesman' || userRole === 'program previewer') {
      return user.allowedPages?.includes(link.href);
    }

    return true;
  });

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <img src="/logo.png" alt="BedArt Group" className="h-9 w-auto object-contain" />
            <span className="text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">Showcase</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  { 'bg-muted text-primary': pathname.startsWith(link.href) }
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 space-y-3">
          <Separator />

          {/* Tester Role Switcher */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                ڕۆڵی تێستەر:
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {user?.role}
              </Badge>
            </div>
            <Select
              value={user?.role || 'Admin'}
              onValueChange={(val) => switchRole(val as Role)}
              dir="rtl"
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="گۆڕینی ڕۆڵ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">بەڕێوەبەر (Admin)</SelectItem>
                <SelectItem value="Data Manager">بەڕێوەبەری داتا (Data Manager)</SelectItem>
                <SelectItem value="Salesman">فرۆشیار (Salesman)</SelectItem>
                <SelectItem value="Program Previewer">پیشاندەر (Previewer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user && (
            <Link
              href={tutorialLink.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                { 'bg-muted text-primary': pathname.startsWith(tutorialLink.href) }
              )}
            >
              <tutorialLink.icon className="h-4 w-4" />
              {tutorialLink.label}
            </Link>
          )}

          {user && settingsLink.roles.includes(user.role.toLowerCase()) && (
            <Link
              href={settingsLink.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                { 'bg-muted text-primary': pathname.startsWith(settingsLink.href) }
              )}
            >
              <settingsLink.icon className="h-4 w-4" />
              {settingsLink.label}
            </Link>
          )}

          <ActiveUsers currentUser={user} />

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs h-8 text-muted-foreground hover:text-foreground"
            onClick={handleResetData}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            نوێکردنەوەی داتای دێمۆ
          </Button>
        </div>
      </div>
    </div>
  );
}
