import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CONSTANTS } from './constants';
import { calculateEarnings, calculateDeduction, formatTime } from './utils';

interface TimerState {
  personId: number;
  activityId: number;
  startTime: number | null;
  elapsedSeconds: number;
  pausedDurationSeconds: number;
  status: 'running' | 'paused' | 'stopped';
  setPersonId: (id: number) => void;
  setActivityId: (id: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => { 
    elapsedSeconds: number; 
    durationMinutes: number; 
    personId: number; 
    activityId: number; 
  };
  reset: () => void;
  tick: () => void;
  getFormattedTime: () => string;
  getCurrentEarnings: () => number;
  getCurrentDeduction: () => number;
}

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      personId: CONSTANTS.PERSONS[0].id,
      activityId: CONSTANTS.ACTIVITIES[0].id,
      startTime: null,
      elapsedSeconds: 0,
      pausedDurationSeconds: 0,
      status: 'stopped',
      
      setPersonId: (id) => set({ personId: id }),
      setActivityId: (id) => set({ activityId: id }),
      
      start: () => set({ 
        startTime: Date.now(), 
        elapsedSeconds: 0,
        pausedDurationSeconds: 0,
        status: 'running' 
      }),
      
      pause: () => {
        const now = Date.now();
        const { startTime, elapsedSeconds, pausedDurationSeconds } = get();
        
        if (startTime) {
          const newElapsedSeconds = elapsedSeconds + Math.floor((now - startTime) / 1000) - pausedDurationSeconds;
          set({ 
            elapsedSeconds: newElapsedSeconds,
            status: 'paused'
          });
        }
      },
      
      resume: () => set({ 
        startTime: Date.now(),
        status: 'running' 
      }),
      
      stop: () => {
        const now = Date.now();
        const { startTime, elapsedSeconds, pausedDurationSeconds, status } = get();
        
        let finalElapsedSeconds = elapsedSeconds;
        
        if (status === 'running' && startTime) {
          finalElapsedSeconds += Math.floor((now - startTime) / 1000) - pausedDurationSeconds;
        }
        
        set({ 
          elapsedSeconds: finalElapsedSeconds,
          status: 'stopped'
        });
        
        return {
          elapsedSeconds: finalElapsedSeconds,
          durationMinutes: finalElapsedSeconds / 60,
          personId: get().personId,
          activityId: get().activityId
        };
      },
      
      reset: () => set({ 
        startTime: null,
        elapsedSeconds: 0,
        pausedDurationSeconds: 0,
        status: 'stopped' 
      }),
      
      tick: () => {
        const { status, startTime, elapsedSeconds, pausedDurationSeconds } = get();
        
        if (status === 'running' && startTime) {
          const now = Date.now();
          const newElapsedSeconds = elapsedSeconds + Math.floor((now - startTime) / 1000) - pausedDurationSeconds;
          
          set({
            startTime: now,
            elapsedSeconds: newElapsedSeconds,
            pausedDurationSeconds: 0
          });
        }
      },
      
      getFormattedTime: () => {
        const { status, startTime, elapsedSeconds, pausedDurationSeconds } = get();
        
        let totalSeconds = elapsedSeconds;
        
        if (status === 'running' && startTime) {
          const now = Date.now();
          totalSeconds += Math.floor((now - startTime) / 1000) - pausedDurationSeconds;
        }
        
        return formatTime(totalSeconds);
      },
      
      getCurrentEarnings: () => {
        const { elapsedSeconds, personId, status, startTime, pausedDurationSeconds } = get();
        const person = CONSTANTS.PERSONS.find(p => p.id === personId);
        
        if (!person) return 0;
        
        let totalSeconds = elapsedSeconds;
        
        if (status === 'running' && startTime) {
          const now = Date.now();
          totalSeconds += Math.floor((now - startTime) / 1000) - pausedDurationSeconds;
        }
        
        const minutes = totalSeconds / 60;
        return calculateEarnings(minutes, person.hourlyRate);
      },
      
      getCurrentDeduction: () => {
        const { personId } = get();
        const person = CONSTANTS.PERSONS.find(p => p.id === personId);
        
        if (!person) return 0;
        
        const earnings = get().getCurrentEarnings();
        return calculateDeduction(earnings, person.deductionRate);
      }
    }),
    {
      name: CONSTANTS.STORAGE_KEYS.TIMER_STATE,
    }
  )
);

export default useTimerStore;
