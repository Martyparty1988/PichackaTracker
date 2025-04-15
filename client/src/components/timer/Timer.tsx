import React, { useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { TimerControls } from './TimerControls';
import { CONSTANTS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Play, Pause, StopCircle, Clock, DollarSign } from 'lucide-react';

export function Timer() {
  const timer = useTimer();
  const persons = CONSTANTS.PERSONS;
  const activities = CONSTANTS.ACTIVITIES;
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Determine if we've been running a long time (more than 8 hours)
  const isLongSession = timer.status !== 'stopped' && 
    timer.currentDurationMinutes > 8 * 60;
  
  return (
    <section className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 relative">
        <div className="flex items-center">
          <h2 className="text-xl sm:text-2xl font-heading font-bold">Časovač práce</h2>
          
          {/* Status badge */}
          {timer.status !== 'stopped' && (
            <Badge 
              variant={timer.status === 'running' ? "default" : "secondary"}
              className="ml-2"
            >
              {timer.status === 'running' ? 'Běží' : 'Pozastaveno'}
            </Badge>
          )}
        </div>
        
        {/* Long session warning */}
        {isLongSession && (
          <div className="flex items-center mt-2 mb-2 md:mt-0 text-amber-500 text-sm md:absolute md:right-0 md:top-[-24px]">
            <AlertTriangle size={16} className="mr-1" />
            <span>Dlouhé měření ({Math.floor(timer.currentDurationMinutes / 60)} h)</span>
          </div>
        )}
        
        {/* Person Selector - mobile responsive */}
        <div className="mt-4 md:mt-0 flex flex-wrap md:flex-nowrap items-center gap-2 bg-neutral-50 p-1 rounded-lg md:rounded-full">
          {persons.map(person => (
            <button
              key={person.id}
              className={cn(
                "py-2 px-3 md:px-4 rounded-full text-sm md:text-base transition-colors flex-1 md:flex-none",
                timer.personId === person.id 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => timer.actions.setPersonId(person.id)}
            >
              {person.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Activity Selector with enhanced UI */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="activity" className="block text-sm font-medium text-gray-500">Aktivita</label>
          <div 
            className="text-sm text-gray-500 flex items-center cursor-pointer" 
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <Info size={14} className="mr-1" />
            <span className="underline text-xs sm:text-sm">Sazba: {timer.person?.hourlyRate} Kč/h</span>
          </div>
        </div>
        <Select
          value={timer.activityId.toString()}
          onValueChange={(value) => timer.actions.setActivityId(Number(value))}
        >
          <SelectTrigger className="w-full h-10 rounded-lg">
            <SelectValue placeholder="Vyberte aktivitu" />
          </SelectTrigger>
          <SelectContent>
            {activities.map(activity => (
              <SelectItem key={activity.id} value={activity.id.toString()}>
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                    style={{ backgroundColor: activity.color }}
                  ></span>
                  <span>{activity.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Timer Display with animations */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#F5F5F5" strokeWidth="8" />
            
            {/* Progress circle with better animation */}
            <motion.circle
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke={timer.status === 'running' ? "#6366F1" : 
                      timer.status === 'paused' ? "#F59E0B" : "#94A3B8"}
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={timer.status === 'stopped' ? 283 : 0}
              initial={{ strokeDashoffset: timer.status === 'stopped' ? 283 : 0 }}
              animate={{ 
                strokeDashoffset: timer.status === 'running' ? [0, 283] : undefined,
              }}
              transition={{ 
                duration: 60, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "linear"
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="text-4xl sm:text-5xl font-bold"
              animate={{ scale: timer.status === 'running' ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 2, repeat: timer.status === 'running' ? Infinity : 0 }}
            >
              {timer.formattedTime}
            </motion.span>
            
            {/* Activity indicator */}
            {timer.activity && (
              <div className="flex items-center mt-2">
                <span 
                  className="w-2 h-2 rounded-full mr-1 flex-shrink-0" 
                  style={{ backgroundColor: timer.activity.color }}
                ></span>
                <span className="text-gray-500 text-sm">
                  {timer.activity.name}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Timer Controls - enhanced for mobile */}
        <TimerControls />
        
        {/* Current Earnings - Tabs for better mobile organization */}
        <div className="mt-6 w-full max-w-md">
          <Tabs defaultValue="earnings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="earnings" className="text-sm">
                <DollarSign size={14} className="mr-1" /> Výdělek
              </TabsTrigger>
              <TabsTrigger value="time" className="text-sm">
                <Clock size={14} className="mr-1" /> Čas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="earnings" className="mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <span className="text-xs text-gray-500 block mb-1">Výdělek</span>
                  <span className="text-lg sm:text-xl font-bold">
                    {formatCurrency(timer.currentEarnings)}
                  </span>
                </div>
                <div className="bg-secondary/10 rounded-lg p-3 text-center">
                  <span className="text-xs text-gray-500 block mb-1">Srážka</span>
                  <span className="text-lg sm:text-xl font-bold">
                    {formatCurrency(timer.currentDeduction)}
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="time" className="mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <span className="text-xs text-gray-500 block mb-1">Zahájeno</span>
                  <span className="text-sm sm:text-base font-medium">
                    {timer.startTimeFormatted || 'Neaktivní'}
                  </span>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <span className="text-xs text-gray-500 block mb-1">Celkově</span>
                  <span className="text-sm sm:text-base font-medium">
                    {Math.floor(timer.currentDurationMinutes / 60)} h {timer.currentDurationMinutes % 60} min
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
