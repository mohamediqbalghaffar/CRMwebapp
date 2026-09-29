'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDb } from '@/firebase/mock-store';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { toast } = useToast();

  const handleResetData = () => {
    mockDb.resetToDefault();
    toast({
      title: 'داتای دێمۆ نوێکرایەوە',
      description: 'هەموو داتاکان گەڕانەوە بۆ باری سەرەتایی دێمۆ.',
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
      <div className="flex items-center gap-2 font-semibold">
        <img src="/logo.png" alt="BedArt Group" className="h-8 w-auto object-contain" />
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
          Showcase
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs flex items-center gap-1"
          onClick={handleResetData}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          نوێکردنەوە
        </Button>
      </div>
    </header>
  );
}
