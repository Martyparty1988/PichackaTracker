import React, { useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { TimerControls } from './TimerControls';
import { CONSTANTS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Timer() {
  const timer = useTimer();
  const persons = CONSTANTS.PERSONS;
  const activities = CONSTANTS.ACTIVITIES;
  
  return (
    <section className="bg-white rounded-2xl shadow-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold mb-4 md:mb-0">Časovač práce</h2>
        
        {/* Person Selector */}
        <div className="flex items-center space-x-2 p-1 bg-neutral-gray rounded-full">
          {persons.map(person => (
            <button
              key={person.id}
              className={cn(
                "py-2 px-4 rounded-full transition-colors",
                timer.personId === person.id 
                  ? "bg-primary text-white" 
                  : "text-dark hover:bg-gray-200"
              )}
              onClick={() => timer.actions.setPersonId(person.id)}
            >
              {person.name} ({person.hourlyRate} Kč/h)
            </button>
          ))}
        </div>
      </div>
      
      {/* Activity Selector */}
      <div className="mb-6">
        <label htmlFor="activity" className="block text-sm font-medium text-gray-500 mb-2">Aktivita</label>
        <Select
          value={timer.activityId.toString()}
          onValueChange={(value) => timer.actions.setActivityId(Number(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vyberte aktivitu" />
          </SelectTrigger>
          <SelectContent>
            {activities.map(activity => (
              <SelectItem key={activity.id} value={activity.id.toString()}>
                <div className="flex items-center">
                  <span 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: activity.color }}
                  ></span>
                  {activity.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#F5F5F5" strokeWidth="8" />
            
            {/* Progress circle */}
            <motion.circle
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#B39DDB" 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 0 }}
              animate={{ 
                strokeDashoffset: timer.status === 'running' ? [0, 283] : undefined,
              }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "linear"
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{timer.formattedTime}</span>
            <span className="text-gray-500 mt-2">
              Hodinová sazba: {timer.person?.hourlyRate} Kč/h
            </span>
          </div>
        </div>
        
        {/* Timer Controls */}
        <TimerControls />
        
        {/* Current Earnings */}
        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <span className="text-sm text-gray-500 block mb-1">Aktuální výdělek</span>
            <span className="text-xl font-bold">
              {formatCurrency(timer.currentEarnings)}
            </span>
          </div>
          <div className="bg-secondary/10 rounded-lg p-4 text-center">
            <span className="text-sm text-gray-500 block mb-1">Aktuální srážka</span>
            <span className="text-xl font-bold">
              {formatCurrency(timer.currentDeduction)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
