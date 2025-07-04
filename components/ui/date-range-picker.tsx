// DateRangePicker Component

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import React from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

interface DateRangePickerProps {
    value: { validFrom: Date; validUntil: Date };
    onChange: (value: { validFrom: Date; validUntil: Date }) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const DateRangePicker = ({ 
    value, 
    onChange, 
    placeholder = "Pick a date range",
    className,
    disabled = false 
  }: DateRangePickerProps) => {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  
    // Sync internal state with form value
    React.useEffect(() => {
      if (value?.validFrom && value?.validUntil) {
        setDate({
          from: value.validFrom,
          to: value.validUntil
        });
      } else {
        setDate(undefined);
      }
    }, [value]);
  
    const handleDateSelect: SelectRangeEventHandler = (dateRange) => {
      setDate(dateRange);
      
      // Convert DateRange to form values
      if (dateRange?.from && dateRange?.to) {
        onChange({
          validFrom: dateRange.from,
          validUntil: dateRange.to
        });
      } else if (dateRange?.from) {
        // If only start date is selected
        onChange({
          validFrom: dateRange.from,
          validUntil: dateRange.from
        });
      } else {
        // Clear values
        onChange({
          validFrom: new Date(),
          validUntil: new Date()
        });
      }
    };
  
    return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  export default DateRangePicker;