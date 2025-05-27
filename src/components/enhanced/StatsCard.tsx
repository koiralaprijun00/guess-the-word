import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Brain, Target, TrendingUp } from 'lucide-react';

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
  const streak = sessionData?.totalKnown || 0;

  return (
    <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with stats */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Session Progress</span>
            </h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {accuracyRate}% Accuracy
            </Badge>
          </div>

          {/* Main stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">{sessionData?.totalKnown || 0}</p>
                <p className="text-xs text-muted-foreground font-medium">Known</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-orange-600">{sessionData?.totalUnknown || 0}</p>
                <p className="text-xs text-muted-foreground font-medium">Learning</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-600">{sessionData?.shownWordIds?.length || 0}</p>
                <p className="text-xs text-muted-foreground font-medium">Reviewed</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {sessionData?.shownWordIds?.length || 0} / {allWordsLength} words
              </span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 