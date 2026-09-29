'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4" dir="rtl">
      <Card className="w-[440px] text-center shadow-lg border-primary/20">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="p-3 bg-primary/10 rounded-full text-primary mb-2">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-xl">دۆخی پێشاندان (Showcase Mode)</CardTitle>
          <CardDescription>
            ئەم پڕۆژەیە وەک نموونەی کارکراو بەردەستە. چوونەژوورەوە و دروستکردنی هەژمار پێویست نییە و هەموو بەشەکان بە شێوەی ئۆتۆماتیکی کراوەن بۆ تێستەر.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ڕاستەوخۆ دەگوازرێیتەوە بۆ داشبۆرد...
          </p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            <ArrowLeft className="ml-2 h-4 w-4" />
            چوونە داشبۆردی سەرەکی
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
