import React from 'react';
import { useTimer } from '@/hooks/useTimer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

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
    if (confirm("Opravdu chcete ukončit a uložit tento pracovní záznam?")) {
      actions.stop();
      toast({
        title: "Záznam uložen",
        description: "Váš pracovní záznam byl úspěšně uložen.",
      });
    }
  };
  
  return (
    <div className="flex space-x-4">
      {status === 'stopped' && (
        <motion.div
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleStart}
            className="py-3 px-6 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            <i className='bx bx-play mr-2'></i> Start
          </Button>
        </motion.div>
      )}
      
      {status === 'running' && (
        <motion.div
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handlePause}
            className="py-3 px-6 rounded-full bg-accent text-dark font-medium hover:bg-accent-dark transition-colors"
          >
            <i className='bx bx-pause mr-2'></i> Pauza
          </Button>
        </motion.div>
      )}
      
      {status === 'paused' && (
        <motion.div
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleResume}
            className="py-3 px-6 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            <i className='bx bx-play mr-2'></i> Pokračovat
          </Button>
        </motion.div>
      )}
      
      {(status === 'running' || status === 'paused') && (
        <motion.div
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleStop}
            className="py-3 px-6 rounded-full bg-secondary text-dark font-medium hover:bg-secondary-dark transition-colors"
          >
            <i className='bx bx-stop mr-2'></i> Stop
          </Button>
        </motion.div>
      )}
    </div>
  );
}
