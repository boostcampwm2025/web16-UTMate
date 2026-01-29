import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Interest, Gender, AgeGroup } from '@/features/(auth)/types/persona';
import { Label } from '@/shared/components/ui/label';

import { InterestFilter } from './InterestFilter';

interface SearchFilterProps {
  gender: Gender | undefined;
  ageGroup: AgeGroup | undefined;
  selectedInterests: Interest[];
  onGenderChange: (value: Gender | undefined) => void;
  onAgeGroupChange: (value: AgeGroup | undefined) => void;
  onInterestToggle: (interest: Interest) => void;
}

export function SearchFilter({
  gender,
  ageGroup,
  selectedInterests,
  onGenderChange,
  onAgeGroupChange,
  onInterestToggle,
}: SearchFilterProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Gender & Age */}
        <div className="flex shrink-0 gap-4">
          <div className="w-[140px] space-y-2">
            <Label>성별</Label>
            <Select
              value={gender || 'ALL'}
              onValueChange={(value) =>
                onGenderChange(value === 'ALL' ? undefined : (value as Gender))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="성별 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모두</SelectItem>
                <SelectItem value="MALE">남성</SelectItem>
                <SelectItem value="FEMALE">여성</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[140px] space-y-2">
            <Label>연령대</Label>
            <Select
              value={ageGroup || 'ALL'}
              onValueChange={(value) =>
                onAgeGroupChange(value === 'ALL' ? undefined : (value as AgeGroup))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="연령대 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모두</SelectItem>
                <SelectItem value="10">10대</SelectItem>
                <SelectItem value="20">20대</SelectItem>
                <SelectItem value="30">30대</SelectItem>
                <SelectItem value="40">40대</SelectItem>
                <SelectItem value="50">50대</SelectItem>
                <SelectItem value="60+">60대 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Interests */}
        <InterestFilter selectedInterests={selectedInterests} onInterestToggle={onInterestToggle} />
      </div>
    </div>
  );
}
