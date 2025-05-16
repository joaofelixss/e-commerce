"use client";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface DatePickerRangeProps {
  onDateChange: (dates: [Date | null, Date | null]) => void;
}

const DatePickerRange: React.FC<DatePickerRangeProps> = ({ onDateChange }) => {
  const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    onDateChange(date);
  }, [date, onDateChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="date">Filtrar por Período:</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date?.[0] && !date?.[1] && "text-muted-foreground"
            )}
          >
            {date?.[0] && date?.[1] ? (
              <span>
                {format(date[0]!, "PPP")} - {format(date[1]!, "PPP")}
              </span>
            ) : date?.[0] ? (
              <span>{format(date[0]!, "PPP")} - Selecione a data final</span>
            ) : (
              <span>Selecionar Período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            defaultMonth={new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerRange;
