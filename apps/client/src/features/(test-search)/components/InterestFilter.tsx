import { Plus } from 'lucide-react';

import { Interest } from '@/features/(auth)/types/persona';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button';
import { ResponsiveDialog } from '@/shared/components/ResponsiveDialog';
import { useToggle } from '@/shared/hooks/useToggle';

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
  const [isOpen, toggle, setIsOpen] = useToggle(false);
  const interests = Object.values(Interest);

  return (
    <div className="flex flex-col justify-between">
      <Label>관심사</Label>
      <Button variant="outline" onClick={toggle} className="rounded-full px-2 font-normal">
        {selectedInterests.length > 0
          ? selectedInterests.length > 2
            ? `${selectedInterests[0]} 외 ${selectedInterests.length - 1}`
            : selectedInterests.join(', ')
          : '모두'}
        <Plus className="text-muted-foreground h-4 w-4" />
      </Button>
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="관심사"
        description="관심사를 선택해주세요."
      >
        <div className="flex flex-wrap gap-2 p-2">
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest);

            return (
              <Badge
                key={interest}
                variant="outline"
                className={cn(
                  'bg-card cursor-pointer px-2 py-1 text-sm font-medium transition-colors',
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
      </ResponsiveDialog>
    </div>
  );
}
