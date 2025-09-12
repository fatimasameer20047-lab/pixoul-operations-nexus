import { format } from 'date-fns';

export interface Shift {
  id: string;
  user_name: string;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
}

const STORAGE_KEY = 'arcade_shifts';

class ShiftService {
  private shifts: Shift[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.shifts = stored ? JSON.parse(stored) : [];
    } catch {
      this.shifts = [];
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.shifts));
  }

  addShift(shift: Omit<Shift, 'id'>): Shift {
    const newShift: Shift = {
      ...shift,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    // Validate shift times
    if (!this.isValidShiftTime(newShift.start_time, newShift.end_time)) {
      throw new Error('Start time must be before end time');
    }

    // Check for overlapping shifts
    if (this.hasOverlappingShift(newShift)) {
      throw new Error('This shift overlaps with an existing shift for the same person');
    }

    this.shifts.push(newShift);
    this.saveToStorage();
    return newShift;
  }

  getShiftsForDate(date: string): Shift[] {
    return this.shifts.filter(shift => shift.date === date);
  }

  getShiftsForWeek(weekStart: Date): Shift[] {
    const dates = this.getWeekDates(weekStart);
    return this.shifts.filter(shift => dates.includes(shift.date));
  }

  deleteShift(id: string): boolean {
    const index = this.shifts.findIndex(shift => shift.id === id);
    if (index === -1) return false;
    
    this.shifts.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  private isValidShiftTime(startTime: string, endTime: string): boolean {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return startMinutes < endMinutes;
  }

  private hasOverlappingShift(newShift: Shift): boolean {
    const existingShifts = this.getShiftsForDate(newShift.date)
      .filter(shift => shift.user_name === newShift.user_name);
    
    if (existingShifts.length === 0) return false;

    const [newStart, newEnd] = this.getShiftMinutes(newShift.start_time, newShift.end_time);

    return existingShifts.some(shift => {
      const [existingStart, existingEnd] = this.getShiftMinutes(shift.start_time, shift.end_time);
      
      // Check if shifts overlap
      return (newStart < existingEnd && newEnd > existingStart);
    });
  }

  private getShiftMinutes(startTime: string, endTime: string): [number, number] {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    return [
      startHour * 60 + startMin,
      endHour * 60 + endMin
    ];
  }

  private getWeekDates(weekStart: Date): string[] {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dates.push(format(date, 'yyyy-MM-dd'));
    }
    return dates;
  }

  formatDateWithDay(date: string, dayOfWeek: number): string {
    const dateObj = new Date(date + 'T00:00:00');
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return `${dayNames[dayOfWeek - 1]} • ${format(dateObj, 'MMM dd, yyyy')}`;
  }
}

export const shiftService = new ShiftService();