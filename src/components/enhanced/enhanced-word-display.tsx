import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordDisplayCardProps {
  word: {
    id: number;
    nepali: string;
    roman: string;
    meaning_nepali: string;
    meaning_english: string;
  };
  timeLeft: number;
  timerDuration: number;
  meaningsVisible: boolean;
  isLoadingWord: boolean;
  onEarlyAssessment?: (knewIt: boolean) => void;
  onFinalAssessment?: (knewIt: boolean) => void;
  showEarlyAssessment?: boolean;
  showFinalAssessment?: boolean;
}

export const EnhancedWordDisplayCard: React.FC<WordDisplayCardProps> = ({
  word,
  timeLeft,
  timerDuration,
  meaningsVisible,
  isLoadingWord,
  onEarlyAssessment,
  onFinalAssessment,
  showEarlyAssessment = true,
  showFinalAssessment = true
}) => {
  const [showCard, setShowCard] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [earlyAssessmentMade, setEarlyAssessmentMade] = useState(false);
  const [selectedEarlyAnswer, setSelectedEarlyAnswer] = useState<boolean | null>(null);
  const [selectedFinalAnswer, setSelectedFinalAnswer] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (word && !isLoadingWord) {
      setShowCard(true);
      setCardFlipped(false);
      setEarlyAssessmentMade(false);
      setSelectedEarlyAnswer(null);
      setSelectedFinalAnswer(null);
    } else {
      setShowCard(false);
    }
  }, [word, isLoadingWord]);

  useEffect(() => {
    if (meaningsVisible) {
      setCardFlipped(true);
    }
  }, [meaningsVisible]);

  const handleEarlyAssessment = (knewIt: boolean) => {
    setSelectedEarlyAnswer(knewIt);
    setEarlyAssessmentMade(true);
    setTimeout(() => {
      onEarlyAssessment?.(knewIt);
    }, 300);
  };

  const handleFinalAssessment = (knewIt: boolean) => {
    setSelectedFinalAnswer(knewIt);
    setTimeout(() => {
      onFinalAssessment?.(knewIt);
      setSelectedFinalAnswer(null);
    }, 300);
  };

  const timerProgress = timerDuration > 0 ? ((timerDuration - timeLeft) / timerDuration) * 100 : 0;
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';

  if (isLoadingWord || !word) {
    return (
      <div className="relative w-full h-96 flex items-center justify-center">
        <Card className="w-full shadow-2xl bg-gradient-to-br from-gradient-yellow via-gradient-orange to-gradient-magenta p-1 animate-pulse">
          <CardContent className="bg-card p-8 rounded-md h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-spin">
              <div className="w-full h-full rounded-full border-4 border-white border-t-transparent"></div>
            </div>
            <div className="text-xl font-medium text-muted-foreground animate-bounce">
              {isLoadingWord ? 'Preparing next word...' : 'Ready to start learning!'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full perspective-1000 space-y-4" style={{ perspective: '1000px' }}>
      <div 
        className={cn(
          "relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d",
          cardFlipped && "rotate-y-180"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card - Word */}
        <Card className={cn(
          "absolute inset-0 shadow-2xl backface-hidden bg-gradient-to-br from-gradient-yellow via-gradient-orange to-gradient-magenta p-1 transition-all duration-300",
          showCard ? "scale-100 opacity-100" : "scale-95 opacity-0",
          urgencyLevel === 'urgent' && "shadow-red-500/50"
        )}>
          <CardContent className="bg-card p-8 rounded-md h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-float"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-float-delayed"></div>
            </div>
            
            {/* Main word display */}
            <div className="relative z-10 text-center space-y-6 flex-1 flex flex-col justify-center">
              <div className={cn(
                "text-6xl md:text-7xl font-bold text-foreground transition-all duration-300 font-devanagari",
                "hover:scale-105 cursor-default select-none",
                urgencyLevel === 'urgent' && "text-red-600"
              )}>
                {word.nepali}
              </div>
              
              {/* Enhanced timer */}
              {!meaningsVisible && (
                <div className="space-y-4">
                  <div className="relative">
                    <Progress 
                      value={timerProgress} 
                      className={cn(
                        "w-full h-3 transition-all duration-300"
                      )}
                    />
                    <div className={cn(
                      "absolute inset-0 rounded-full",
                      urgencyLevel === 'urgent' && "bg-red-500/20"
                    )}></div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className={cn(
                      "w-4 h-4 transition-colors",
                      urgencyLevel === 'urgent' ? "text-red-500" : 
                      urgencyLevel === 'warning' ? "text-orange-500" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-lg font-mono font-semibold transition-colors",
                      urgencyLevel === 'urgent' ? "text-red-500" : 
                      urgencyLevel === 'warning' ? "text-orange-500" : "text-muted-foreground"
                    )}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>
              )}

              {/* Early Assessment Buttons - Inside Card */}
              {showEarlyAssessment && !meaningsVisible && !earlyAssessmentMade && (
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-green-500 text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
                      selectedEarlyAnswer === true && "scale-110 shadow-xl bg-green-500 text-white border-green-600"
                    )}
                    onClick={() => handleEarlyAssessment(true)}
                    disabled={selectedEarlyAnswer !== null}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center transition-all group-hover:bg-green-500/30",
                        selectedEarlyAnswer === true && "bg-white/20"
                      )}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">I Know This!</span>
                      <span className="text-xs opacity-70">(Y)</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline" 
                    size="lg"
                    className={cn(
                      "bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 border-red-500 text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
                      selectedEarlyAnswer === false && "scale-110 shadow-xl bg-red-500 text-white border-red-600"
                    )}
                    onClick={() => handleEarlyAssessment(false)}
                    disabled={selectedEarlyAnswer !== null}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center transition-all group-hover:bg-red-500/30",
                        selectedEarlyAnswer === false && "bg-white/20"
                      )}>
                        <XCircle className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">Show Me</span>
                      <span className="text-xs opacity-70">(N)</span>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back of card - Meanings */}
        <Card className={cn(
          "absolute inset-0 shadow-2xl backface-hidden bg-gradient-to-br from-gradient-yellow via-gradient-orange to-gradient-magenta p-1 rotate-y-180"
        )}>
          <CardContent className="bg-card p-8 rounded-md h-full flex flex-col justify-center space-y-6 relative overflow-hidden">

            <div className="space-y-6 text-center">
              {/* Romanization */}
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs font-semibold">ROMANIZATION</Badge>
                <p className="text-2xl font-semibold text-foreground font-english">{word.roman}</p>
              </div>

              {/* Nepali meaning */}
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs font-semibold">नेपाली अर्थ</Badge>
                <p className="text-lg text-foreground/90 font-devanagari leading-relaxed">{word.meaning_nepali}</p>
              </div>

              {/* English meaning */}
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs font-semibold">ENGLISH MEANING</Badge>
                <p className="text-lg text-foreground/90 font-english leading-relaxed">{word.meaning_english}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Assessment Buttons - After Meanings Shown */}
      {showFinalAssessment && meaningsVisible && (
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-green-500 text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
              selectedFinalAnswer === true && "scale-110 shadow-xl bg-green-500 text-white border-green-600"
            )}
            onClick={() => handleFinalAssessment(true)}
            disabled={selectedFinalAnswer !== null}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center transition-all group-hover:bg-green-500/30",
                selectedFinalAnswer === true && "bg-white/20"
              )}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="font-semibold">I Knew It!</span>
              <span className="text-xs opacity-70">(Y)</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 border-red-500 text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
              selectedFinalAnswer === false && "scale-110 shadow-xl bg-red-500 text-white border-red-600"
            )}
            onClick={() => handleFinalAssessment(false)}
            disabled={selectedFinalAnswer !== null}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center transition-all group-hover:bg-red-500/30",
                selectedFinalAnswer === false && "bg-white/20"
              )}>
                <XCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold">I Didn't Know</span>
              <span className="text-xs opacity-70">(N)</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}; 