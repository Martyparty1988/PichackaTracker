import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency, formatDuration, formatDate } from '@/lib/utils';
import { CONSTANTS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface WorkLog {
  id: number;
  personId: number;
  activityId: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  earnings: number;
  deduction: number;
}

interface ChartData {
  byDay: { name: string; minutes: number; earnings: number }[];
  byActivity: { name: string; minutes: number; earnings: number; color: string }[];
  byPerson: { name: string; minutes: number; earnings: number }[];
}

export default function WorkLogs() {
  const [filter, setFilter] = useState({
    search: '',
    person: 'all',
    activity: 'all',
    dateFrom: '',
    dateTo: ''
  });
  
  const { data: workLogs, isLoading: logsLoading } = useQuery<WorkLog[]>({
    queryKey: ['/api/work-logs'],
  });
  
  const { data: chartData, isLoading: chartLoading } = useQuery<ChartData>({
    queryKey: ['/api/work-logs/charts'],
  });
  
  // Filter work logs based on current filter
  const filteredLogs = workLogs ? workLogs.filter(log => {
    // Filter by search term
    if (filter.search && !CONSTANTS.ACTIVITIES.find(a => a.id === log.activityId)?.name.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    // Filter by person
    if (filter.person !== 'all' && log.personId !== parseInt(filter.person)) {
      return false;
    }
    
    // Filter by activity
    if (filter.activity !== 'all' && log.activityId !== parseInt(filter.activity)) {
      return false;
    }
    
    // Filter by date range
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      const logDate = new Date(log.startTime);
      if (logDate < fromDate) {
        return false;
      }
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      const logDate = new Date(log.startTime);
      if (logDate > toDate) {
        return false;
      }
    }
    
    return true;
  }) : [];
  
  return (
    <div className="pb-20 md:pb-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pracovní záznamy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Hledat podle aktivity..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            <div>
              <Select
                value={filter.person}
                onValueChange={(value) => setFilter({ ...filter, person: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Osoba" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všechny osoby</SelectItem>
                  {CONSTANTS.PERSONS.map(person => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filter.activity}
                onValueChange={(value) => setFilter({ ...filter, activity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aktivita" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všechny aktivity</SelectItem>
                  {CONSTANTS.ACTIVITIES.map(activity => (
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
            <div>
              <Input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
                placeholder="Od"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Osoba</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Aktivita</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Začátek</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Konec</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Doba</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Výdělek</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Srážka</th>
                </tr>
              </thead>
              <tbody>
                {!logsLoading && filteredLogs.map((log) => (
                  <motion.tr 
                    key={log.id} 
                    className="hover:bg-neutral-gray cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-3 px-4">{formatDate(new Date(log.startTime))}</td>
                    <td className="py-3 px-4">
                      {CONSTANTS.PERSONS.find(p => p.id === log.personId)?.name || 'Neznámá osoba'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span 
                          className="w-2 h-2 rounded-full mr-2" 
                          style={{ backgroundColor: CONSTANTS.ACTIVITIES.find(a => a.id === log.activityId)?.color || '#B39DDB' }}
                        ></span>
                        {CONSTANTS.ACTIVITIES.find(a => a.id === log.activityId)?.name || 'Neznámá aktivita'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(log.startTime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(log.endTime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">{formatDuration(log.durationMinutes)}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(log.earnings)}</td>
                    <td className="py-3 px-4">{formatCurrency(log.deduction)}</td>
                  </motion.tr>
                ))}
                
                {filteredLogs.length === 0 && !logsLoading && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Nebyly nalezeny žádné záznamy odpovídající filtru.
                    </td>
                  </tr>
                )}
                
                {logsLoading && Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-12"></div></td>
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-12"></div></td>
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-14"></div></td>
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistiky</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList>
              <TabsTrigger value="daily">Denní přehled</TabsTrigger>
              <TabsTrigger value="activity">Podle aktivity</TabsTrigger>
              <TabsTrigger value="person">Podle osoby</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="pt-4">
              <div className="h-80">
                {!chartLoading && chartData?.byDay && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.byDay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#B39DDB" />
                      <YAxis yAxisId="right" orientation="right" stroke="#FFCC80" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="minutes" name="Minuty" fill="#B39DDB" />
                      <Bar yAxisId="right" dataKey="earnings" name="Výdělek (Kč)" fill="#FFCC80" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="pt-4">
              <div className="h-80">
                {!chartLoading && chartData?.byActivity && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.byActivity}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="minutes"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.byActivity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [formatDuration(value), name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="person" className="pt-4">
              <div className="h-80">
                {!chartLoading && chartData?.byPerson && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.byPerson}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value: number, name: string) => [
                        name === "minutes" ? formatDuration(value) : formatCurrency(value),
                        name === "minutes" ? "Odpracováno" : "Výdělek"
                      ]} />
                      <Legend />
                      <Bar dataKey="minutes" name="Minuty" fill="#B39DDB" />
                      <Bar dataKey="earnings" name="Výdělek" fill="#FFCC80" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
