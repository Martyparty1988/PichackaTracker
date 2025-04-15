import React, { useState, useEffect, useMemo } from 'react';
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
  
  // No need for an additional interval here as the useTimer hook already has one
  
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
      
      {/* Fixní motivační slogan - jeden stačí */}
      <div className="mb-3 text-center text-gray-600 italic px-4">
        Každá minuta se počítá! 💪
      </div>
      
      {/* Simplified Timer Display with focus on readability */}
      <div className="flex flex-col items-center justify-center">
        {/* Main Timer Display */}
        <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6 w-full max-w-sm">
          {/* Person and Activity Info */}
          <div className="flex items-center justify-center mb-4 w-full">
            {timer.person && (
              <div className="bg-gray-100 rounded-full py-1 px-3 mr-2 flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  {timer.person.name}
                </span>
              </div>
            )}
            
            {timer.activity && (
              <div className="flex items-center bg-gray-100 rounded-full py-1 px-3">
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 mr-2" 
                  style={{ backgroundColor: timer.activity.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {timer.activity.name}
                </span>
              </div>
            )}
          </div>
          
          {/* Status Indicator */}
          {timer.status !== 'stopped' && (
            <div className="mb-2 flex items-center">
              {timer.status === 'running' ? (
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
              )}
              <span className="text-xs font-medium text-gray-500">
                {timer.status === 'running' ? 'Měření probíhá' : 'Pozastaveno'}
              </span>
            </div>
          )}
          
          {/* Timer Digits - Large and Clear */}
          <div className="text-center mb-4">
            <div className="text-6xl sm:text-7xl font-bold font-mono tracking-tight">
              {timer.formattedTime}
            </div>
            
            {/* Duration in hours and minutes */}
            <div className="text-sm text-gray-500 mt-1">
              {Math.floor(timer.currentDurationMinutes / 60)} h {timer.currentDurationMinutes % 60} min
            </div>
          </div>
          
          {/* Real-time Earnings Display */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="rounded-lg p-3 text-center border border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500 block mb-1">Výdělek</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(timer.currentEarnings)}
              </span>
            </div>
            <div className="rounded-lg p-3 text-center border border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500 block mb-1">Srážka</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(timer.currentDeduction)}
              </span>
            </div>
          </div>
          
          {/* Show start time when running */}
          {timer.status !== 'stopped' && (
            <div className="text-xs text-gray-500 mt-3">
              Zahájeno: {timer.startTimeFormatted || 'Neaktivní'}
            </div>
          )}
        </div>
        
        {/* Timer Controls */}
        <TimerControls />
      </div>
    </section>
  );
}
