import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { shiftService, type Shift } from '@/services/shiftService';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users } from 'lucide-react';

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

function getWeekDates(weekStart: Date): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }
  return dates;
}

export const DailyScheduleViewer = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(getCurrentDayOfWeek());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    // Load shifts for the current week from local storage
    const weekShifts = shiftService.getShiftsForWeek(currentWeekStart);
    setShifts(weekShifts);
  }, [currentWeekStart]);

  const getShiftsForDay = (dayOfWeek: number): Shift[] => {
    const weekDates = getWeekDates(currentWeekStart);
    const targetDate = weekDates[dayOfWeek - 1];
    return shifts.filter(shift => shift.date === targetDate);
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const goToPreviousDay = () => {
    setSelectedDay(selectedDay === 1 ? 7 : selectedDay - 1);
  };

  const goToNextDay = () => {
    setSelectedDay(selectedDay === 7 ? 1 : selectedDay + 1);
  };

  const selectedDayShifts = getShiftsForDay(selectedDay);
  const selectedDayName = days[selectedDay - 1];

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="flex items-center justify-between bg-muted rounded-lg p-4">
        <Button variant="outline" onClick={goToPreviousDay}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous Day
        </Button>
        <div className="text-center">
          <h2 className="font-semibold text-xl flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5" />
            {shiftService.formatDateWithDay(getWeekDates(currentWeekStart)[selectedDay - 1], selectedDay)}
          </h2>
        </div>
        <Button variant="outline" onClick={goToNextDay}>
          Next Day
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayOfWeek = index + 1;
          const isSelected = dayOfWeek === selectedDay;
          const dayShifts = getShiftsForDay(dayOfWeek);
          
          return (
            <Button
              key={day}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDay(dayOfWeek)}
              className="flex flex-col h-16 p-2"
            >
              <span className="text-xs font-medium">{day.slice(0, 3)}</span>
              <Badge variant="secondary" className="text-xs">
                {dayShifts.length}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Daily Schedule Display */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {selectedDayName} Schedule
          </h3>
          <Badge variant="outline">
            {selectedDayShifts.length} shift{selectedDayShifts.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading schedule...</p>
          </div>
        ) : selectedDayShifts.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No shifts scheduled for {selectedDayName}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDayShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{shift.user_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  On Duty
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          📅 Demo mode - Showing sample schedule data
        </p>
      </div>
    </div>
  );
};