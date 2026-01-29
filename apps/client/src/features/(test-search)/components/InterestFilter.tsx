import React, { useState } from 'react';
import { Interest } from '@/features/(auth)/types/persona';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const INTEREST_EMOJI_MAP: Record<Interest, string> = {
  [Interest.EDUCATION]: '📚',
  [Interest.LANGUAGES]: '🗣️',
  [Interest.SELF_IMPROVEMENT]: '💪',
  [Interest.SCIENCE]: '🔬',
  [Interest.READING]: '📖',
  [Interest.IT]: '💻',
  [Interest.GAMING]: '🎮',
  [Interest.PRODUCTIVITY]: '⚙️',
  [Interest.BUSINESS]: '💼',
  [Interest.AI]: '🤖',
  [Interest.MEDIA]: '📺',
  [Interest.MOVIES]: '🎬',
  [Interest.ANIMATION]: '🎨',
  [Interest.FASHION]: '👗',
  [Interest.BEAUTY]: '💄',
  [Interest.SHOPPING]: '🛍️',
  [Interest.FINANCE]: '💰',
  [Interest.REAL_ESTATE]: '🏠',
  [Interest.STOCKS]: '📈',
  [Interest.MUSIC]: '🎵',
  [Interest.INSTRUMENTS]: '🎸',
  [Interest.TRAVEL]: '✈️',
  [Interest.PHOTOGRAPHY]: '📸',
  [Interest.OUTDOORS]: '⛺',
  [Interest.SPORTS]: '⚽',
  [Interest.HEALTH]: '💊',
  [Interest.FITNESS]: '🏋️',
  [Interest.COMMUNITY]: '🤝',
  [Interest.SOCIAL]: '📱',
  [Interest.PETS]: '🐾',
  [Interest.PARENTING]: '👶',
  [Interest.INTERIOR]: '🛋️',
};

interface InterestFilterProps {
  selectedInterests: Interest[];
  onInterestToggle: (interest: Interest) => void;
}

export function InterestFilter({ selectedInterests, onInterestToggle }: InterestFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const interests = Object.values(Interest);

  return (
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Label>관심사</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground h-8 px-2 text-xs"
        >
          {isExpanded ? (
            <>
              접기 <ChevronUp className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              더보기 <ChevronDown className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      </div>
      <div
        className={cn(
          'flex flex-wrap gap-2 overflow-hidden transition-[max-height] duration-800 ease-in-out',
          isExpanded ? 'max-h-[500px]' : 'max-h-[68px]',
        )}
      >
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest);

          return (
            <Badge
              key={interest}
              variant="outline"
              className={cn(
                'cursor-pointer px-2 py-1 text-sm font-medium transition-colors',
                isSelected && 'bg-primary text-primary-foreground',
              )}
              onClick={() => onInterestToggle(interest)}
            >
              <span className="mr-1.5">{INTEREST_EMOJI_MAP[interest]}</span>
              {interest}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
