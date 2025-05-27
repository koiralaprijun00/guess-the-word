"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface TimerSelectorProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
  options?: number[];
}

const defaultOptions = [5, 8, 10, 15];

export function TimerSelector({
  selectedDuration,
  onDurationChange,
  disabled = false,
  options = defaultOptions,
}: TimerSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Label htmlFor="timer-duration" className="text-sm font-medium text-foreground/80 font-english">
        Timer Duration (seconds)
      </Label>
      <RadioGroup
        id="timer-duration"
        value={String(selectedDuration)}
        onValueChange={(value) => onDurationChange(Number(value))}
        className="flex space-x-4"
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={String(option)} id={`timer-${option}s`} />
            <Label htmlFor={`timer-${option}s`} className={cn("font-english", disabled && "text-muted-foreground")}>
              {option}s
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
