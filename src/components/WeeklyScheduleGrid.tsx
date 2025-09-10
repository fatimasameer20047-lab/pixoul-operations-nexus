import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthProvider';
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

function getMonday(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Mock shifts data
const generateMockShifts = (weekStart: Date): Shift[] => {
  return [
    { id: '1', user_name: 'Fatima Samer', day_of_week: 1, start_time: '09:00', end_time: '17:00', week_start_date: formatDate(weekStart) },
    { id: '2', user_name: 'Hala Samer', day_of_week: 1, start_time: '13:00', end_time: '21:00', week_start_date: formatDate(weekStart) },
    { id: '3', user_name: 'Aliya Haidar', day_of_week: 2, start_time: '10:00', end_time: '18:00', week_start_date: formatDate(weekStart) },
    { id: '4', user_name: 'Fatima Samer', day_of_week: 3, start_time: '09:00', end_time: '17:00', week_start_date: formatDate(weekStart) },
    { id: '5', user_name: 'Hala Samer', day_of_week: 4, start_time: '11:00', end_time: '19:00', week_start_date: formatDate(weekStart) },
    { id: '6', user_name: 'Aliya Haidar', day_of_week: 5, start_time: '09:00', end_time: '17:00', week_start_date: formatDate(weekStart) },
    { id: '7', user_name: 'Fatima Samer', day_of_week: 6, start_time: '12:00', end_time: '20:00', week_start_date: formatDate(weekStart) },
  ];
};

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
    // Load mock shifts for the current week
    setShifts(generateMockShifts(currentWeekStart));
  }, [currentWeekStart]);

  const onSubmit = (data: ShiftForm) => {
    if (!user) return;

    const newShift: Shift = {
      id: Date.now().toString(),
      user_name: user.full_name,
      day_of_week: selectedDay,
      start_time: data.start_time,
      end_time: data.end_time,
      week_start_date: formatDate(currentWeekStart)
    };

    setShifts(prev => [...prev, newShift]);
    
    toast({
      title: "Success",
      description: "Shift added successfully (Demo mode)"
    });
    
    setShowAddForm(false);
    reset();
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getShiftsForDay = (dayOfWeek: number): Shift[] => {
    return shifts.filter(shift => shift.day_of_week === dayOfWeek);
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
            Week of {formatDate(currentWeekStart)}
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
          
          return (
            <Card key={day} className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm">{day}</h3>
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