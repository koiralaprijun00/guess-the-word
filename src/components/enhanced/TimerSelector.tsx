import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Brain, CheckCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerSelectorProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  onStartLearning?: () => void;
  disabled?: boolean;
}

export const EnhancedTimerSelector: React.FC<TimerSelectorProps> = ({
  selectedDuration,
  onDurationChange,
  onStartLearning,
  disabled = false
}) => {
  const options = [5, 8, 10, 15];

  const features = [
    {
      icon: Clock,
      title: "Timed Challenges",
      description: "Test your recall with customizable timers for different difficulty levels",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "AI-powered system adjusts to your knowledge level and learning pace",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Self Assessment",
      description: "Track your progress and focus on words you find challenging",
      color: "from-green-400 to-green-600"
    }
  ];

  return (
    <div className="max-w-xl mx-auto space-y-3 max-h-[50vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-left space-y-1 flex-1">
          <h2 className="text-base font-bold text-foreground">
            Do you know or recognize these words?
          </h2>
          
          <p className="text-sm text-muted-foreground">
            Test your knowledge with a <span className="text-red-500 font-semibold">fun</span>, challenging approach
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-2">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-200 border">
            <CardContent className="p-3 flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center flex-shrink-0",
                feature.color
              )}>
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="text-left space-y-0">
                <h3 className="text-sm font-bold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-xs text-muted-foreground leading-tight">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timer Selection */}
      <Card className="border">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-base font-semibold text-foreground">Timer Duration</h3>
            </div>
            
            <div className="flex justify-center space-x-2">
              {options.map((option) => (
                <Button
                  key={option}
                  variant={selectedDuration === option ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "min-w-[3rem] font-semibold transition-all duration-200",
                    selectedDuration === option ? 
                      "bg-gradient-to-r from-yellow-500 to-orange-700 hover:from-yellow-600 hover:to-orange-800 text-white" :
                      "hover:bg-gray-50",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => onDurationChange(option)}
                  disabled={disabled}
                >
                  {option}s
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 