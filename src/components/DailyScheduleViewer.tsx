import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users } from 'lucide-react';

interface Shift {
  id: string;
  user_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  week_start_date: string;
}

export const DailyScheduleViewer = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(getCurrentDayOfWeek());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  function getCurrentDayOfWeek(): number {
    const today = new Date();
    const day = today.getDay();
    return day === 0 ? 7 : day; // Convert Sunday (0) to 7
  }

  function getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    fetchShifts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('daily-schedule-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_shifts'
        },
        () => {
          fetchShifts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentWeekStart]);

  const fetchShifts = async () => {
    try {
      const weekStartString = formatDate(currentWeekStart);
      
      const { data, error } = await supabase
        .from('weekly_shifts')
        .select('*')
        .eq('week_start_date', weekStartString)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setShifts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load shifts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getShiftsForDay = (dayOfWeek: number) => {
    return shifts.filter(shift => shift.day_of_week === dayOfWeek);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const goToPreviousDay = () => {
    setSelectedDay(prev => prev === 1 ? 7 : prev - 1);
  };

  const goToNextDay = () => {
    setSelectedDay(prev => prev === 7 ? 1 : prev + 1);
  };

  const getDateForDay = (dayOfWeek: number) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayOfWeek - 1);
    return date;
  };

  const selectedDate = getDateForDay(selectedDay);
  const selectedDayShifts = getShiftsForDay(selectedDay);
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Weekly Schedule – Current Week: {days[selectedDay - 1]}
            {isToday && <Badge variant="default">Today</Badge>}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToPreviousDay}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={goToNextDay}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>

      {/* Daily Shifts View */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      ) : (
        <Card className="p-6">
          {selectedDayShifts.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No shifts scheduled for {days[selectedDay - 1]}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Staff on Duty ({selectedDayShifts.length})
              </h3>
              {selectedDayShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{shift.user_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {Math.round((new Date(`2000-01-01T${shift.end_time}`).getTime() - new Date(`2000-01-01T${shift.start_time}`).getTime()) / (1000 * 60 * 60))}h
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Week Overview */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">This Week Overview</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayOfWeek = index + 1;
            const dayShifts = getShiftsForDay(dayOfWeek);
            const dayDate = getDateForDay(dayOfWeek);
            const isDaySelected = dayOfWeek === selectedDay;
            const isDayToday = dayDate.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(dayOfWeek)}
                className={`p-2 rounded-lg text-center transition-colors ${
                  isDaySelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                } ${isDayToday ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="text-xs font-medium">{day.slice(0, 3)}</div>
                <div className="text-xs text-muted-foreground">
                  {dayDate.getDate()}
                </div>
                <div className="text-xs mt-1">
                  {dayShifts.length} shifts
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};