// 'use client';
// import { useState } from 'react';
// import { Calendar } from '@/components/ui/calendar';
// import { Button } from '@/components/ui/button';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent } from '@/components/ui/card';
// import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
// import { formatDate, calculateNights, cn } from '@/lib/utils';

// export default function ImprovedDatePicker({
//   checkIn,
//   checkOut,
//   onCheckInChange,
//   onCheckOutChange,
//   className = ''
// }) {
//   const [isCheckInOpen, setIsCheckInOpen] = useState(false);
//   const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

//   const today = new Date();
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

//   const handleCheckInSelect = (date) => {
//     onCheckInChange?.(date);
//     setIsCheckInOpen(false);

//     if (date && checkOut && checkOut <= date) {
//       onCheckOutChange?.(undefined);
//     }

//     if (date && !checkOut) {
//       setTimeout(() => setIsCheckOutOpen(true), 200);
//     }
//   };

//   const handleCheckOutSelect = (date) => {
//     onCheckOutChange?.(date);
//     setIsCheckOutOpen(false);
//   };

//   const getMinCheckOutDate = () => {
//     if (checkIn) {
//       const minDate = new Date(checkIn);
//       minDate.setDate(minDate.getDate() + 1);
//       return minDate;
//     }
//     return tomorrow;
//   };

//   return (
//     <div className={cn("space-y-4", className)}>
//       <Card className="border-2 border-neutral-100 hover:border-primary/30 transition-colors">
//         <CardContent className="p-4">
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
//                 <CalendarDays className="w-4 h-4 text-primary" />
//                 Check-in
//               </Label>
//               <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-start text-left font-normal h-12 border-2",
//                       !checkIn && "text-neutral-500",
//                       checkIn && "border-primary/20 bg-primary/5"
//                     )}
//                   >
//                     <div className="flex flex-col items-start">
//                       <span className="text-xs text-neutral-500">
//                         {checkIn ? 'Selected' : 'Select date'}
//                       </span>
//                       <span className="font-medium">
//                         {checkIn ? formatDate(checkIn) : 'Add date'}
//                       </span>
//                     </div>
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={checkIn}
//                     onSelect={handleCheckInSelect}
//                     disabled={(date) => date < today}
//                     initialFocus
//                     className="rounded-lg border"
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-primary" />
//                 Check-out
//               </Label>
//               <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-start text-left font-normal h-12 border-2",
//                       !checkOut && "text-neutral-500",
//                       checkOut && "border-primary/20 bg-primary/5",
//                       !checkIn && "opacity-50"
//                     )}
//                     disabled={!checkIn}
//                   >
//                     <div className="flex flex-col items-start">
//                       <span className="text-xs text-neutral-500">
//                         {checkOut ? 'Selected' : checkIn ? 'Select date' : 'Check-out'}
//                       </span>
//                       <span className="font-medium">
//                         {checkOut ? formatDate(checkOut) : 'Add date'}
//                       </span>
//                     </div>
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={checkOut}
//                     onSelect={handleCheckOutSelect}
//                     disabled={(date) => date < getMinCheckOutDate()}
//                     initialFocus
//                     className="rounded-lg border"
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </div>

//           {checkIn && checkOut && nights > 0 && (
//             <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <ArrowRight className="w-4 h-4 text-primary" />
//                   <span className="text-sm font-medium text-neutral-700">
//                     Duration: {nights} night{nights !== 1 ? 's' : ''}
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-xs text-neutral-500">
//                     {formatDate(checkIn)} → {formatDate(checkOut)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

// ImprovedDatePicker.jsx
'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { formatDate, calculateNights, cn } from '@/lib/utils';

export default function ImprovedDatePicker({
  checkIn,
  checkOut,
  checkInTime,
  checkOutTime,
  onCheckInChange,
  onCheckOutChange,
  onCheckInTimeChange,
  onCheckOutTimeChange,
  className = ''
}) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const TIME_OPTIONS = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM", 
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM", 
  "3:00 PM", 
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];


  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

  const handleCheckInSelect = (date) => {
    onCheckInChange?.(date);
    setIsCheckInOpen(false);

    if (date && checkOut && checkOut <= date) {
      onCheckOutChange?.(undefined);
    }

    if (date && !checkOut) {
      setTimeout(() => setIsCheckOutOpen(true), 200);
    }
  };

  const handleCheckOutSelect = (date) => {
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

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-2 border-neutral-100 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
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
              {checkIn && (
               <div className="mt-2">
  <Label className="text-xs text-neutral-500">Check-in Time</Label>
  <select
    className="w-full mt-1 p-2 border rounded text-sm"
    value={checkInTime}
    onChange={(e) => onCheckInTimeChange?.(e.target.value)}
  >
    {TIME_OPTIONS.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
  </select>
</div>
              )}
            </div>

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
                        {checkOut ? 'Selected' : checkIn ? 'Select date' : 'Check-out'}
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
              {checkOut && (
                <div className="mt-2">
                  <Label className="text-xs text-neutral-500">Check-out Time</Label>
                  <select
                    className="w-full mt-1 p-2 border rounded text-sm"
                    value={checkOutTime}
                    onChange={(e) => onCheckOutTimeChange?.(e.target.value)}
                  >
                   {TIME_OPTIONS.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {checkIn && checkOut && nights > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-neutral-700">
                    Duration: {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right whitespace-nowrap">
  <span className="text-xs text-neutral-500">
    {formatDate(checkIn)} → {formatDate(checkOut)}
  </span>
</div>

              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <div className="space-y-3">
        <Label className="text-sm font-medium text-neutral-700">Quick Select</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: 'This Weekend',
              nights: 2,
              getDates: () => {
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
              }
            },
            {
              label: 'Next Weekend',
              nights: 2,
              getDates: () => {
                const friday = new Date(today);
                const dayOfWeek = friday.getDay();
                const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
                friday.setDate(friday.getDate() + daysUntilFriday + 7);
                const sunday = new Date(friday);
                sunday.setDate(sunday.getDate() + 2);
                return { start: friday, end: sunday };
              }
            },
            {
              label: '3 Days',
              nights: 3,
              getDates: () => {
                const start = new Date(tomorrow);
                const end = new Date(start);
                end.setDate(end.getDate() + 3);
                return { start, end };
              }
            },
            {
              label: '1 Week',
              nights: 7,
              getDates: () => {
                const start = new Date(tomorrow);
                const end = new Date(start);
                end.setDate(end.getDate() + 7);
                return { start, end };
              }
            }
          ].map((option) => {
            const { label, getDates } = option;
            return (
              <Button
                key={label}
                variant="outline"
                size="sm"
                className="h-10 text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                onClick={() => {
                  const { start, end } = getDates();
                  onCheckInChange?.(start);
                  onCheckOutChange?.(end);
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}
