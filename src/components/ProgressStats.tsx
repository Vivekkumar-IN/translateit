
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Globe } from 'lucide-react';

interface ProgressStatsProps {
  translated: number;
  total: number;
  language: string;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ translated, total, language }) => {
  const percentage = Math.round((translated / total) * 100);
  const remaining = total - translated;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Translation Summary
            </h3>
            <Badge variant="secondary" className="text-sm">
              {language.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{translated}</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Remaining</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{remaining}</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{total}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
