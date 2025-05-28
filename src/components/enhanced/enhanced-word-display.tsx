import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WordTimer } from './WordTimer';
import { WordDisplay } from './WordDisplay';
import { EarlyAssessmentButtons } from './EarlyAssessmentButtons';
import { WordMeaning } from './WordMeaning';
import { LoadingWordCard } from './LoadingWordCard';

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

  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';

  if (isLoadingWord || !word) {
    return <LoadingWordCard isLoadingWord={isLoadingWord} />;
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
            <WordDisplay word={word.nepali} timeLeft={timeLeft} />
            
            <WordTimer 
              timeLeft={timeLeft}
              timerDuration={timerDuration}
              meaningsVisible={meaningsVisible}
            />

            <EarlyAssessmentButtons
              onAssessment={handleEarlyAssessment}
              selectedAnswer={selectedEarlyAnswer}
              disabled={selectedEarlyAnswer !== null}
              show={showEarlyAssessment && !meaningsVisible && !earlyAssessmentMade}
            />
          </CardContent>
        </Card>

        {/* Back of card - Meanings */}
        <Card className={cn(
          "absolute inset-0 shadow-2xl rotate-y-180 backface-hidden bg-gradient-to-br from-gradient-magenta via-gradient-orange to-gradient-yellow p-1",
          showCard ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}>
          <CardContent className="bg-card p-8 rounded-md h-full flex flex-col justify-center relative overflow-hidden">
            <WordMeaning
              word={{
                roman: word.roman,
                meaning_nepali: word.meaning_nepali,
                meaning_english: word.meaning_english
              }}
              onFinalAssessment={handleFinalAssessment}
              selectedFinalAnswer={selectedFinalAnswer}
              showFinalAssessment={showFinalAssessment}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 