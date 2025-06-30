'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-react';
import { formatDate, calculateNights } from '@/lib/utils';

export default function EnhancedDatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  className = ''
}) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

  const handleCheckInSelect = (date) => {
    onCheckInChange?.(date);
    setCheckInOpen(false);

    if (date && checkOut && checkOut <= date) {
      onCheckOutChange?.(undefined);
    }

    if (date) {
      setTimeout(() => setCheckOutOpen(true), 100);
    }
  };

  const handleCheckOutSelect = (date) => {
    onCheckOutChange?.(date);
    setCheckOutOpen(false);
  };

  const getMinCheckOutDate = () => {
    if (checkIn) {
      const minDate = new Date(checkIn);
      minDate.setDate(minDate.getDate() + 1);
      return minDate;
    }
    return tomorrow;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-2">
            Check-in
          </Label>
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal input-field"
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                {checkIn ? formatDate(checkIn) : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-2">
            Check-out
          </Label>
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal input-field"
                disabled={!checkIn}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                {checkOut ? formatDate(checkOut) : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={handleCheckOutSelect}
                disabled={(date) => date < getMinCheckOutDate()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {checkIn && checkOut && nights > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Duration:</span>
            <span className="font-medium text-primary">
              {nights} night{nights !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-neutral-700">Quick Select:</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'This Weekend', nights: 2 },
            { label: 'Next Weekend', nights: 2, offset: 7 },
            { label: '3 Days', nights: 3 },
            { label: '1 Week', nights: 7 },
          ].map((option) => (
            <Button
              key={option.label}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const startDate = new Date(today);
                if (option.offset) {
                  startDate.setDate(startDate.getDate() + option.offset);
                } else {
                  startDate.setDate(startDate.getDate() + 1);
                }

                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + option.nights);

                onCheckInChange?.(startDate);
                onCheckOutChange?.(endDate);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
