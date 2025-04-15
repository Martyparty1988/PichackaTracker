import React from 'react';
import { useTimer } from '@/hooks/useTimer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, PauseCircle, StopCircle, Play, Pause, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TimerControls() {
  const { status, actions } = useTimer();
  const { toast } = useToast();
  
  const handleStart = () => {
    actions.start();
    toast({
      title: "Časovač spuštěn",
      description: "Čas se začal zaznamenávat.",
    });
  };
  
  const handlePause = () => {
    actions.pause();
    toast({
      title: "Časovač pozastaven",
      description: "Čas byl dočasně pozastaven.",
    });
  };
  
  const handleResume = () => {
    actions.resume();
    toast({
      title: "Časovač obnoven",
      description: "Čas se opět zaznamenává.",
    });
  };
  
  const handleStop = () => {
    actions.stop();
    toast({
      title: "Záznam uložen",
      description: "Váš pracovní záznam byl úspěšně uložen.",
    });
  };
  
  return (
    <div className="flex flex-wrap gap-2 justify-center w-full max-w-sm">
      {status === 'stopped' && (
        <Button
          onClick={handleStart}
          size="lg"
          className="w-full py-5 bg-gray-800 hover:bg-gray-900 text-white"
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          <span className="font-medium">Start</span>
        </Button>
      )}
      
      {status === 'running' && (
        <Button
          onClick={handlePause}
          size="lg"
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
        >
          <Pause className="mr-2 h-4 w-4" />
          <span className="font-medium">Pauza</span>
        </Button>
      )}
      
      {status === 'paused' && (
        <Button
          onClick={handleResume}
          size="lg"
          className="flex-1 bg-gray-800 hover:bg-gray-900 text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          <span className="font-medium">Pokračovat</span>
        </Button>
      )}
      
      {(status === 'running' || status === 'paused') && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="lg"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              <StopCircle className="mr-2 h-4 w-4" />
              <span className="font-medium">Ukončit</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Ukončit měření času?</AlertDialogTitle>
              <AlertDialogDescription>
                Opravdu chcete ukončit a uložit tento pracovní záznam? Tato akce se nedá vrátit.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex space-x-2">
              <AlertDialogCancel className="mt-0">Zrušit</AlertDialogCancel>
              <AlertDialogAction onClick={handleStop} className="bg-gray-800 hover:bg-gray-900">
                Uložit záznam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
