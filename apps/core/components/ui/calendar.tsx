// components/ui/calendar.tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// CORREÇÃO FINAL: Definindo o array de nomes para garantir o formato de 1 caractere
const WeekdayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Função que formata o nome do dia usando nosso array (forçando 1 letra)
const forceSingleLetterWeekday = (date: Date) => {
    // date.getDay() retorna 0 para Domingo, 1 para Segunda, etc.
    return WeekdayNames[date.getDay()];
}; 

const formatCaption = (date: Date) => format(date, 'LLLL yyyy', { locale: ptBR });

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      locale={ptBR}
      formatters={{
        // CORREÇÃO: Usa a função que garante o formato de 1 letra.
        formatWeekdayName: forceSingleLetterWeekday,
        formatCaption,
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        // Garante cor e tamanho para o cabeçalho dos meses
        caption_label: "text-base font-semibold text-gray-900 capitalize",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        // CORREÇÃO FINAL ALINHAMENTO/COR: Garante centralização e largura para a letra única
        head_cell: "text-gray-900 rounded-md w-9 font-semibold text-[0.8rem] flex justify-center",
        row: "flex w-full mt-2",
        // Células de dia: h-9 w-9 são críticos para a grade.
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        
        // CORREÇÃO DE COR CRÍTICA: Aplicando a cor primária de forma mais específica e abrangente
        day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white data-[state=range-end]:bg-primary data-[state=range-end]:text-white data-[state=range-start]:bg-primary data-[state=range-start]:text-white",
        
        day_today: "bg-gray-100 text-gray-900",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-400 opacity-50",
        // Para o range (dias entre o início e o fim)
        day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900 hover:bg-gray-200",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }