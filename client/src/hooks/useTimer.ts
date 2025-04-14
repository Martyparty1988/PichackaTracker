import { useEffect, useCallback } from 'react';
import useTimerStore from '@/lib/timerStore';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import useFinancesStore from '@/lib/financesStore';
import { CONSTANTS } from '@/lib/constants';

export function useTimer() {
  const {
    personId,
    activityId,
    status,
    setPersonId,
    setActivityId,
    start,
    pause,
    resume,
    stop,
    reset,
    tick,
    getFormattedTime,
    getCurrentEarnings,
    getCurrentDeduction
  } = useTimerStore();

  const { updateDeductionFund } = useFinancesStore();

  // Get the current person details
  const person = CONSTANTS.PERSONS.find(p => p.id === personId);
  const activity = CONSTANTS.ACTIVITIES.find(a => a.id === activityId);

  // Periodic tick to update timer display
  useEffect(() => {
    if (status === 'running') {
      const intervalId = setInterval(() => {
        tick();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [status, tick]);

  // Handle stopping the timer and saving the work log
  const handleStop = useCallback(async () => {
    const result = stop();
    
    if (result.durationMinutes > 0) {
      try {
        const person = CONSTANTS.PERSONS.find(p => p.id === result.personId);
        
        if (!person) return;
        
        const earnings = Math.round((result.durationMinutes / 60) * person.hourlyRate);
        const deduction = Math.round(earnings * person.deductionRate);
        
        // Save to API
        await apiRequest('POST', '/api/work-logs', {
          personId: result.personId,
          activityId: result.activityId,
          startTime: new Date(Date.now() - (result.elapsedSeconds * 1000)),
          endTime: new Date(),
          durationMinutes: result.durationMinutes,
          earnings,
          deduction
        });
        
        // Update deduction fund
        updateDeductionFund(deduction);
        
        // Reset timer
        reset();
        
        // Refresh work logs
        queryClient.invalidateQueries({ queryKey: ['/api/work-logs'] });
      } catch (error) {
        console.error('Failed to save work log:', error);
      }
    }
  }, [stop, reset, updateDeductionFund]);

  return {
    personId,
    activityId,
    status,
    person,
    activity,
    formattedTime: getFormattedTime(),
    currentEarnings: getCurrentEarnings(),
    currentDeduction: getCurrentDeduction(),
    actions: {
      setPersonId,
      setActivityId,
      start,
      pause,
      resume,
      stop: handleStop
    }
  };
}
