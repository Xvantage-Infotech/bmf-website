import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { formatDate, calculateNights } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EnhancedDatePickerProps {
  checkIn?: Date;
  checkOut?: Date;
  onCheckInChange?: (date: Date | undefined) => void;
  onCheckOutChange?: (date: Date | undefined) => void;
  className?: string;
  compact?: boolean;
}

export default function EnhancedDatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  className = '',
  compact = false
}: EnhancedDatePickerProps) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

  const handleCheckInSelect = (date: Date | undefined) => {
    onCheckInChange?.(date);
    setIsCheckInOpen(false);
    
    // If check-out is before new check-in, clear it
    if (date && checkOut && checkOut <= date) {
      onCheckOutChange?.(undefined);
    }
    
    // Auto-open check-out picker
    if (date && !checkOut) {
      setTimeout(() => setIsCheckOutOpen(true), 200);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    onCheckOutChange?.(date);
    setIsCheckOutOpen(false);
  };

  const getMinCheckOutDate = () => {
    if (checkIn) {
      const minDate = new Date(checkIn);
      minDate.setDate(minDate.getDate() + 1);
      return minDate;
    }
    return tomorrow;
  };

  if (compact) {
    return (
      <div className={cn("flex gap-2", className)}>
        {/* Compact Check-in */}
        <div className="flex-1">
          <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 border-2",
                  !checkIn && "text-neutral-500",
                  checkIn && "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs text-neutral-500">Check-in</span>
                  <span className="font-medium">
                    {checkIn ? formatDate(checkIn) : 'Add date'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                disabled={(date) => date < today}
                initialFocus
                className="rounded-lg border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Compact Check-out */}
        <div className="flex-1">
          <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 border-2",
                  !checkOut && "text-neutral-500",
                  checkOut && "border-primary/20 bg-primary/5",
                  !checkIn && "opacity-50"
                )}
                disabled={!checkIn}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs text-neutral-500">Check-out</span>
                  <span className="font-medium">
                    {checkOut ? formatDate(checkOut) : 'Add date'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={handleCheckOutSelect}
                disabled={(date) => date < getMinCheckOutDate()}
                initialFocus
                className="rounded-lg border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enhanced Date Selection Card */}
      <Card className="border-2 border-neutral-100 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Check-in */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Check-in
              </Label>
              <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2",
                      !checkIn && "text-neutral-500",
                      checkIn && "border-primary/20 bg-primary/5"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-neutral-500">
                        {checkIn ? 'Selected' : 'Select date'}
                      </span>
                      <span className="font-medium">
                        {checkIn ? formatDate(checkIn) : 'Add date'}
                      </span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={handleCheckInSelect}
                    disabled={(date) => date < today}
                    initialFocus
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Check-out
              </Label>
              <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2",
                      !checkOut && "text-neutral-500",
                      checkOut && "border-primary/20 bg-primary/5",
                      !checkIn && "opacity-50"
                    )}
                    disabled={!checkIn}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-neutral-500">
                        {checkOut ? 'Selected' : checkIn ? 'Select date' : 'Choose check-in first'}
                      </span>
                      <span className="font-medium">
                        {checkOut ? formatDate(checkOut) : 'Add date'}
                      </span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={handleCheckOutSelect}
                    disabled={(date) => date < getMinCheckOutDate()}
                    initialFocus
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Duration Display */}
          {checkIn && checkOut && nights > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-neutral-700">
                    Duration: {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-500">
                    {formatDate(checkIn)} → {formatDate(checkOut)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Selection Options */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-neutral-700">Quick Select</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'This Weekend', nights: 2, getDates: () => {
              const friday = new Date(today);
              const dayOfWeek = friday.getDay();
              const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
              friday.setDate(friday.getDate() + daysUntilFriday);
              if (daysUntilFriday === 0 && friday.getTime() <= today.getTime()) {
                friday.setDate(friday.getDate() + 7);
              }
              const sunday = new Date(friday);
              sunday.setDate(sunday.getDate() + 2);
              return { start: friday, end: sunday };
            }},
            { label: 'Next Weekend', nights: 2, getDates: () => {
              const friday = new Date(today);
              const dayOfWeek = friday.getDay();
              const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
              friday.setDate(friday.getDate() + daysUntilFriday + 7);
              const sunday = new Date(friday);
              sunday.setDate(sunday.getDate() + 2);
              return { start: friday, end: sunday };
            }},
            { label: '3 Days', nights: 3, getDates: () => {
              const start = new Date(tomorrow);
              const end = new Date(start);
              end.setDate(end.getDate() + 3);
              return { start, end };
            }},
            { label: '1 Week', nights: 7, getDates: () => {
              const start = new Date(tomorrow);
              const end = new Date(start);
              end.setDate(end.getDate() + 7);
              return { start, end };
            }},
          ].map((option) => (
            <Button
              key={option.label}
              variant="outline"
              size="sm"
              className="h-10 text-xs font-medium hover:bg-primary hover:text-white transition-colors"
              onClick={() => {
                const { start, end } = option.getDates();
                onCheckInChange?.(start);
                onCheckOutChange?.(end);
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