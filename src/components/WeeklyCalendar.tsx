import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Calendar, Clock } from 'lucide-react';

interface Shift {
  id: string;
  user_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  week_start_date: string;
}

interface ShiftForm {
  start_time: string;
  end_time: string;
}

export const WeeklyCalendar = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [showCurrentDay, setShowCurrentDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { register, handleSubmit, reset } = useForm<ShiftForm>();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  function getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function getCurrentDayOfWeek(): number {
    const today = new Date();
    const day = today.getDay();
    return day === 0 ? 7 : day; // Convert Sunday (0) to 7
  }

  useEffect(() => {
    fetchShifts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('shifts-realtime')
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

  const onSubmit = async (data: ShiftForm) => {
    if (!currentUser || selectedDay === null) return;

    try {
      const weekStartString = formatDate(currentWeekStart);
      
      // Use upsert to handle existing shifts
      const { error } = await supabase
        .from('weekly_shifts')
        .upsert({
          user_id: crypto.randomUUID(),
          user_name: currentUser,
          day_of_week: selectedDay,
          start_time: data.start_time,
          end_time: data.end_time,
          week_start_date: weekStartString
        }, {
          onConflict: 'user_id, day_of_week, week_start_date'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Shift added for ${days[selectedDay - 1]}`
      });

      reset();
      setSelectedDay(null);
      fetchShifts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getShiftsForDay = (dayOfWeek: number) => {
    return shifts.filter(shift => shift.day_of_week === dayOfWeek);
  };

  const getCurrentDayShifts = () => {
    const currentDay = getCurrentDayOfWeek();
    return getShiftsForDay(currentDay);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const getDateForDay = (dayOfWeek: number) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayOfWeek - 1);
    return date;
  };

  if (showCurrentDay) {
    const currentDay = getCurrentDayOfWeek();
    const currentDayShifts = getCurrentDayShifts();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Today's Schedule - {days[currentDay - 1]}
          </h2>
          <Button variant="outline" onClick={() => setShowCurrentDay(false)}>
            View Full Week
          </Button>
        </div>

        <Card className="p-6">
          {currentDayShifts.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No shifts scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentDayShifts.map((shift) => (
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Weekly Schedule</h2>
          <Button variant="outline" onClick={() => setShowCurrentDay(true)}>
            Today's View
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToPreviousWeek}>
            ← Previous
          </Button>
          <Button variant="outline" onClick={goToCurrentWeek}>
            Current Week
          </Button>
          <Button variant="outline" onClick={goToNextWeek}>
            Next →
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Week of {currentWeekStart.toLocaleDateString()} - {getDateForDay(7).toLocaleDateString()}
      </div>

      {/* Add Shift Form */}
      {selectedDay && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Add Shift for {days[selectedDay - 1]}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                {...register('start_time', { required: true })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                {...register('end_time', { required: true })}
                className="mt-1"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1">
                Add Shift
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSelectedDay(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Calendar Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map((day, index) => {
            const dayOfWeek = index + 1;
            const dayShifts = getShiftsForDay(dayOfWeek);
            const dayDate = getDateForDay(dayOfWeek);
            const isToday = dayDate.toDateString() === new Date().toDateString();
            
            return (
              <Card key={day} className={`p-4 ${isToday ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold">{day}</h3>
                    <p className="text-xs text-muted-foreground">
                      {dayDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedDay(dayOfWeek)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 min-h-[200px]">
                  {dayShifts.map((shift) => (
                    <div key={shift.id} className="bg-muted p-2 rounded text-xs">
                      <p className="font-medium">{shift.user_name}</p>
                      <p className="text-muted-foreground">
                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                      </p>
                    </div>
                  ))}
                  {dayShifts.length === 0 && (
                    <p className="text-muted-foreground text-xs">No shifts</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};