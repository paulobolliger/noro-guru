'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal h-11 px-4 py-3 border-gray-300 rounded-lg text-gray-900',
              !date && 'text-gray-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} -{' '}
                  {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Selecione as datas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
            formatters={{
              formatWeekdayName: (date) => ['D','S','T','Q','Q','S','S'][date.getDay()],
              formatCaption: (date) => format(date, 'LLLL yyyy', { locale: ptBR }),
            }}
            classNames={{
              caption_label: "text-base font-semibold text-gray-900 capitalize",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
              day_range_middle: "bg-blue-100 text-gray-900 hover:bg-blue-200",
              day_today: "bg-gray-100 text-gray-900",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-400 opacity-50",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
