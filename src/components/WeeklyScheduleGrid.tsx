import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Clock } from 'lucide-react';

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

export const WeeklyScheduleGrid = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
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
    if (!currentUser) return;

    try {
      const weekStartString = formatDate(currentWeekStart);
      
      const { error } = await supabase
        .from('weekly_shifts')
        .upsert({
          user_id: currentUser.id,
          user_name: currentUser.full_name,
          staff_account_id: currentUser.id,
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
      setShowAddForm(false);
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

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const openAddShiftDialog = (dayOfWeek: number) => {
    setSelectedDay(dayOfWeek);
    setShowAddForm(true);
  };

  const getDateForDay = (dayOfWeek: number) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayOfWeek - 1);
    return date;
  };

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Weekly Schedule Grid</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToPreviousWeek}>
            ← Previous Week
          </Button>
          <Button variant="outline" onClick={goToCurrentWeek}>
            Current Week
          </Button>
          <Button variant="outline" onClick={goToNextWeek}>
            Next Week →
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Week of {currentWeekStart.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>

      {/* Weekly Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => {
            const dayOfWeek = index + 1;
            const dayShifts = getShiftsForDay(dayOfWeek);
            const dayDate = getDateForDay(dayOfWeek);
            const isToday = dayDate.toDateString() === new Date().toDateString();
            
            return (
              <Card key={day} className={`p-4 min-h-[300px] ${isToday ? 'ring-2 ring-primary' : ''}`}>
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="font-semibold">{day}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dayDate.getDate()}
                    </p>
                    {isToday && (
                      <p className="text-xs text-primary font-medium">Today</p>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => openAddShiftDialog(dayOfWeek)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Shift
                  </Button>
                  
                  <div className="space-y-2">
                    {dayShifts.length === 0 ? (
                      <div className="text-center py-4">
                        <Clock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">No shifts</p>
                      </div>
                    ) : (
                      dayShifts.map((shift) => (
                        <div key={shift.id} className="bg-muted rounded-lg p-2">
                          <p className="font-medium text-sm">{shift.user_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Shift Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shift for {days[selectedDay - 1]}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Add Shift
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};