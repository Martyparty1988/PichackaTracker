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
      
      {/* Enhanced Timer Display with sophisticated animations */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 mb-6">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Base track circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="42" 
              fill="none" 
              stroke="#F5F5F5" 
              strokeWidth="3" 
              className="opacity-80"
            />
            
            {/* Accent track */}
            <circle 
              cx="50" 
              cy="50" 
              r="42" 
              fill="none" 
              stroke="#E5E7EB" 
              strokeWidth="1" 
              strokeDasharray="4,6"
              className="opacity-50"
            />
            
            {/* 60 minute markers */}
            {[...Array(60)].map((_, i) => {
              const isQuarter = i % 15 === 0;
              const isFiveMin = i % 5 === 0;
              
              return (
                <line 
                  key={i}
                  x1="50" 
                  y1="8" 
                  x2="50" 
                  y2={isQuarter ? "10" : isFiveMin ? "11" : "12"}
                  stroke={isQuarter ? "#6366F1" : isFiveMin ? "#94A3B8" : "#D1D5DB"}
                  strokeWidth={isQuarter ? "2" : "1"}
                  strokeLinecap="round"
                  transform={`rotate(${i * 6} 50 50)`}
                  className={isQuarter ? "opacity-90" : "opacity-50"}
                />
              );
            })}
            
            {/* Inside fill circle for backdrop */}
            <circle 
              cx="50" 
              cy="50" 
              r="35" 
              fill="#FFFFFF" 
              className="opacity-30" 
            />
            
            {/* Progress circle with enhanced animation */}
            <motion.circle
              cx="50" 
              cy="50" 
              r="42" 
              fill="none" 
              stroke={timer.status === 'running' ? "#6366F1" : 
                      timer.status === 'paused' ? "#F59E0B" : "#94A3B8"}
              strokeWidth="6" 
              strokeLinecap="round"
              strokeDasharray="264"
              strokeDashoffset="264"
              initial={{ 
                strokeDashoffset: 264,
                pathLength: 1
              }}
              animate={{ 
                strokeDashoffset: timer.status === 'running' ? 0 : 
                                 timer.status === 'paused' ? 132 : 264
              }}
              transition={{ 
                duration: timer.status === 'running' ? 60 : 0.5,
                ease: timer.status === 'stopped' ? "backIn" : 
                      timer.status === 'paused' ? "circOut" : "linear"
              }}
            />
            
            {/* Animated dots on the progress circle */}
            {timer.status === 'running' && (
              <motion.circle
                cx="50"
                cy="8"
                r="2.5"
                fill="#6366F1"
                animate={{ 
                  rotate: [0, 360] 
                }}
                transition={{ 
                  duration: 60,
                  ease: "linear",
                  repeat: Infinity
                }}
                style={{ 
                  transformOrigin: "center center",
                  filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.5))"
                }}
              />
            )}
            
            {/* Secondary time markers */}
            <circle 
              cx="50" 
              cy="50" 
              r="30" 
              fill="none" 
              stroke="#F3F4F6" 
              strokeWidth="1" 
              className="opacity-70"
            />
          </svg>
          
          {/* Center content with time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="flex flex-col items-center justify-center bg-white rounded-full w-40 h-40 shadow-sm"
              animate={{ 
                scale: timer.status === 'running' ? [1, 1.005, 1] : 1,
                boxShadow: timer.status === 'running' ? 
                  ['0 0 0 rgba(99, 102, 241, 0)', '0 0 15px rgba(99, 102, 241, 0.2)', '0 0 0 rgba(99, 102, 241, 0)'] : 
                  '0 0 0 rgba(99, 102, 241, 0)'
              }}
              transition={{ 
                duration: 3, 
                repeat: timer.status === 'running' ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              <motion.span 
                className="text-4xl sm:text-5xl font-bold"
                animate={{ 
                  scale: timer.status === 'running' ? [1, 1.01, 1] : 1,
                  color: timer.status === 'running' ? ['#1F2937', '#4F46E5', '#1F2937'] : '#1F2937'
                }}
                transition={{ 
                  duration: 2, 
                  repeat: timer.status === 'running' ? Infinity : 0
                }}
              >
                {timer.formattedTime}
              </motion.span>
              
              {/* Activity indicator with enhanced styling */}
              {timer.activity && (
                <div className="flex items-center gap-1 mt-2 bg-gray-50 px-3 py-1 rounded-full">
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: timer.activity.color }}
                  />
                  <span className="text-gray-600 text-sm font-medium">
                    {timer.activity.name}
                  </span>
                </div>
              )}
              
              {/* Running animation dot */}
              {timer.status === 'running' && (
                <motion.div 
                  className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              )}
            </motion.div>
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
