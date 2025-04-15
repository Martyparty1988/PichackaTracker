import { useEffect, useCallback, useMemo } from 'react';
import useTimerStore from '@/lib/timerStore';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import useFinancesStore from '@/lib/financesStore';
import { CONSTANTS } from '@/lib/constants';
import { formatDate, formatTime } from '@/lib/utils';

export function useTimer() {
  const {
    personId,
    activityId,
    status,
    startTime,
    elapsedSeconds,
    pausedDurationSeconds,
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

  // Calculate current duration in minutes for display
  const currentDurationMinutes = useMemo(() => {
    let totalSeconds = elapsedSeconds;
    
    if (status === 'running' && startTime) {
      const now = Date.now();
      totalSeconds += Math.floor((now - startTime) / 1000) - pausedDurationSeconds;
    }
    
    return Math.floor(totalSeconds / 60);
  }, [elapsedSeconds, status, startTime, pausedDurationSeconds]);

  // Format the start time for display
  const startTimeFormatted = useMemo(() => {
    if (!startTime) return '';
    
    // If we're in a stopped state, calculate when the timer actually started
    if (status === 'stopped') {
      return '—';
    }
    
    // For running or paused, calculate when the timer started
    const actualStartTime = new Date(Date.now() - (elapsedSeconds * 1000) - (startTime ? Date.now() - startTime : 0));
    return formatDate(actualStartTime);
  }, [startTime, status, elapsedSeconds]);

  // Periodic tick to update timer display
  useEffect(() => {
    if (status === 'running') {
      const intervalId = setInterval(() => {
        tick();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [status, tick]);

  // Set up vibration for timer events if available
  const vibrateDevice = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.log('Vibration not supported');
      }
    }
  }, []);

  // Enhanced start function with haptic feedback
  const enhancedStart = useCallback(() => {
    vibrateDevice(100);
    start();
  }, [start, vibrateDevice]);

  // Enhanced pause function with haptic feedback
  const enhancedPause = useCallback(() => {
    vibrateDevice([50, 50, 50]);
    pause();
  }, [pause, vibrateDevice]);

  // Enhanced resume function with haptic feedback
  const enhancedResume = useCallback(() => {
    vibrateDevice(100);
    resume();
  }, [resume, vibrateDevice]);

  // Handle stopping the timer and saving the work log
  const handleStop = useCallback(async () => {
    vibrateDevice([100, 100, 200]);
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
  }, [stop, reset, updateDeductionFund, vibrateDevice]);

  return {
    personId,
    activityId,
    status,
    person,
    activity,
    formattedTime: getFormattedTime(),
    currentEarnings: getCurrentEarnings(),
    currentDeduction: getCurrentDeduction(),
    currentDurationMinutes,
    startTimeFormatted,
    actions: {
      setPersonId,
      setActivityId,
      start: enhancedStart,
      pause: enhancedPause,
      resume: enhancedResume,
      stop: handleStop
    }
  };
}
