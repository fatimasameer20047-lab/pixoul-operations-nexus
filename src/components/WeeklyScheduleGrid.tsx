import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthProvider';
import { shiftService, type Shift } from '@/services/shiftService';
import { format } from 'date-fns';
import { Plus, Clock } from 'lucide-react';

interface ShiftForm {
  start_time: string;
  end_time: string;
}

function getMonday(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function getWeekDates(weekStart: Date): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }
  return dates;
}

export const WeeklyScheduleGrid = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm<ShiftForm>();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    // Load shifts for the current week from local storage
    const weekShifts = shiftService.getShiftsForWeek(currentWeekStart);
    setShifts(weekShifts);
  }, [currentWeekStart]);

  const onSubmit = (data: ShiftForm) => {
    if (!user) return;

    try {
      const weekDates = getWeekDates(currentWeekStart);
      const targetDate = weekDates[selectedDay - 1];

      const newShift = shiftService.addShift({
        user_name: user.full_name,
        date: targetDate,
        start_time: data.start_time,
        end_time: data.end_time
      });

      // Refresh shifts display
      setShifts(prev => [...prev, newShift]);
      
      toast({
        title: "Success",
        description: "Shift added successfully"
      });
      
      setShowAddForm(false);
      reset();
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getShiftsForDay = (dayOfWeek: number): Shift[] => {
    const weekDates = getWeekDates(currentWeekStart);
    const targetDate = weekDates[dayOfWeek - 1];
    return shifts.filter(shift => shift.date === targetDate);
  };

  const openAddShiftDialog = (dayOfWeek: number) => {
    setSelectedDay(dayOfWeek);
    setShowAddForm(true);
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
      <div className="flex items-center justify-between bg-muted rounded-lg p-4">
        <Button variant="outline" onClick={goToPreviousWeek}>
          ← Previous Week
        </Button>
        <div className="text-center">
          <h2 className="font-semibold text-lg">
            Week of {format(currentWeekStart, 'MMM dd, yyyy')}
          </h2>
          <Button variant="ghost" size="sm" onClick={goToCurrentWeek}>
            Go to Current Week
          </Button>
        </div>
        <Button variant="outline" onClick={goToNextWeek}>
          Next Week →
        </Button>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const dayOfWeek = index + 1;
          const dayShifts = getShiftsForDay(dayOfWeek);
          const weekDates = getWeekDates(currentWeekStart);
          const dayDate = new Date(weekDates[index] + 'T00:00:00');
          
          return (
            <Card key={day} className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{day}</h3>
                  <p className="text-xs text-muted-foreground">{format(dayDate, 'MMM dd')}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openAddShiftDialog(dayOfWeek)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {dayShifts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No shifts</p>
                ) : (
                  dayShifts.map((shift) => (
                    <div key={shift.id} className="bg-primary/10 rounded p-2 text-xs">
                      <p className="font-medium">{shift.user_name}</p>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Shift Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Shift for {days[selectedDay - 1]}
            </DialogTitle>
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
              <Button type="submit" disabled={loading}>
                Add Shift
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};