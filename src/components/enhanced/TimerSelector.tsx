import React, { useState } from 'react';
import { Clock, Star, Brain, Zap, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WordDifficulty } from '@/types';

interface TimerSelectorProps {
  onStartGame: (timerMinutes: number, difficulty: WordDifficulty) => void;
}

const TIMER_OPTIONS = [
  { value: 5, label: '5 सेकेन्ड' },
  { value: 10, label: '10 सेकेन्ड' },
  { value: 15, label: '15 सेकेन्ड' },
  { value: 20, label: '20 सेकेन्ड' }
];

const DIFFICULTY_OPTIONS = [
  { 
    value: 'easy' as WordDifficulty, 
    label: 'सजिलो (Easy)', 
    icon: Star
  },
  { 
    value: 'medium' as WordDifficulty, 
    label: 'मध्यम (Medium)', 
    icon: Brain
  },
  { 
    value: 'difficult' as WordDifficulty, 
    label: 'कठिन (Difficult)', 
    icon: Zap
  }
];

export default function TimerSelector({ onStartGame }: TimerSelectorProps) {
  const [selectedTimer, setSelectedTimer] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<WordDifficulty>('medium');

  const handleStartGame = () => {
    onStartGame(selectedTimer, selectedDifficulty);
  };

  return (
    <div className="max-h-[50vh] overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Settings
          </h2>
          <p className="text-sm text-gray-600">
            Select difficulty level and time per word
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Difficulty Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Difficulty Level
            </h3>
            <div className="space-y-2">
              {DIFFICULTY_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDifficulty === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedDifficulty(option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-4 w-4 ${
                        selectedDifficulty === option.value ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timer Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Time Per Word
            </h3>
            <div className="space-y-2">
              {TIMER_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTimer === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedTimer(option.value)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    <Clock className={`h-4 w-4 ${
                      selectedTimer === option.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center pt-4">
          <Button
            onClick={handleStartGame}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
} 