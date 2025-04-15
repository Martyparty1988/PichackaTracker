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
  
  // Animations for the buttons
  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    tap: { scale: 0.97 }
  };
  
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {status === 'stopped' && (
        <motion.div
          initial="initial"
          animate="animate"
          whileTap="tap"
          variants={buttonVariants}
          className="w-full sm:w-auto flex justify-center"
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="rounded-full px-6 py-6 h-auto w-[60%] sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-md"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            <span className="font-medium">Start</span>
          </Button>
        </motion.div>
      )}
      
      {status === 'running' && (
        <motion.div
          initial="initial"
          animate="animate"
          whileTap="tap"
          variants={buttonVariants}
          className="flex-1 sm:flex-none"
        >
          <Button
            onClick={handlePause}
            size="lg"
            className="rounded-full px-5 py-2 h-12 w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white shadow-md"
          >
            <Pause className="mr-2 h-4 w-4" />
            <span className="font-medium">Pauza</span>
          </Button>
        </motion.div>
      )}
      
      {status === 'paused' && (
        <motion.div
          initial="initial"
          animate="animate"
          whileTap="tap"
          variants={buttonVariants}
          className="flex-1 sm:flex-none"
        >
          <Button
            onClick={handleResume}
            size="lg"
            className="rounded-full px-5 py-2 h-12 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-md"
          >
            <Play className="mr-2 h-4 w-4" />
            <span className="font-medium">Pokračovat</span>
          </Button>
        </motion.div>
      )}
      
      {(status === 'running' || status === 'paused') && (
        <ShadcnAlertDialog>
          <ShadcnAlertDialogTrigger asChild>
            <motion.div
              initial="initial"
              animate="animate"
              whileTap="tap"
              variants={buttonVariants}
              className="flex-1 sm:flex-none"
            >
              <Button
                size="lg"
                className="rounded-full px-5 py-2 h-12 w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white shadow-md"
              >
                <StopCircle className="mr-2 h-4 w-4" />
                <span className="font-medium">Ukončit</span>
              </Button>
            </motion.div>
          </ShadcnAlertDialogTrigger>
          <ShadcnAlertDialogContent className="rounded-lg">
            <ShadcnAlertDialogHeader>
              <ShadcnAlertDialogTitle>Ukončit měření času?</ShadcnAlertDialogTitle>
              <ShadcnAlertDialogDescription>
                Opravdu chcete ukončit a uložit tento pracovní záznam? Tato akce se nedá vrátit.
              </ShadcnAlertDialogDescription>
            </ShadcnAlertDialogHeader>
            <ShadcnAlertDialogFooter className="flex space-x-2">
              <ShadcnAlertDialogCancel className="mt-0">Zrušit</ShadcnAlertDialogCancel>
              <ShadcnAlertDialogAction onClick={handleStop} className="bg-primary hover:bg-primary/90">
                Uložit záznam
              </ShadcnAlertDialogAction>
            </ShadcnAlertDialogFooter>
          </ShadcnAlertDialogContent>
        </ShadcnAlertDialog>
      )}
    </div>
  );
}
