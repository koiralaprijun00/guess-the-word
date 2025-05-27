import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SessionData {
  totalKnown: number;
  totalUnknown: number;
  shownWordIds: number[];
}

interface StatsCardProps {
  sessionData: SessionData;
  progressPercentage: number;
  allWordsLength: number;
}

export const EnhancedStatsCard: React.FC<StatsCardProps> = ({
  sessionData,
  progressPercentage,
  allWordsLength
}) => {
  const totalAnswered = (sessionData?.totalKnown || 0) + (sessionData?.totalUnknown || 0);
  const accuracyRate = totalAnswered > 0 ? Math.round(((sessionData?.totalKnown || 0) / totalAnswered) * 100) : 0;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {sessionData?.shownWordIds?.length || 0}/{allWordsLength}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>{sessionData?.totalKnown || 0} Known</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-600">
              <XCircle className="w-4 h-4" />
              <span>{sessionData?.totalUnknown || 0} Learning</span>
            </div>
            <div className="text-blue-600 font-medium">
              {accuracyRate}% Accuracy
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 