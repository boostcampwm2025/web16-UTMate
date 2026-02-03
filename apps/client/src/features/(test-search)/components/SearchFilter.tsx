import { NativeSelect, NativeSelectOption } from '@/shared/components/ui/native-select';
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
  const handleGenderSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onGenderChange(value === 'ALL' ? undefined : (value as Gender));
  };

  const handleAgeGroupSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onAgeGroupChange(value === 'ALL' ? undefined : (value as AgeGroup));
  };

  return (
    <div className="flex shrink-0 gap-4">
      <div className="flex flex-col gap-2">
        <Label>성별</Label>

        <NativeSelect
          value={gender || 'ALL'}
          onChange={handleGenderSelectChange}
          className="bg-card w-full rounded-full"
        >
          <NativeSelectOption value="ALL">모두</NativeSelectOption>
          <NativeSelectOption value="남성">남성</NativeSelectOption>
          <NativeSelectOption value="여성">여성</NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-2">
        <Label>연령대</Label>
        <NativeSelect
          value={ageGroup || 'ALL'}
          onChange={handleAgeGroupSelectChange}
          className="bg-card w-full rounded-full"
        >
          <NativeSelectOption value="ALL">모두</NativeSelectOption>
          <NativeSelectOption value="10대">10대</NativeSelectOption>
          <NativeSelectOption value="20대">20대</NativeSelectOption>
          <NativeSelectOption value="30대">30대</NativeSelectOption>
          <NativeSelectOption value="40대">40대</NativeSelectOption>
          <NativeSelectOption value="50대">50대</NativeSelectOption>
          <NativeSelectOption value="60대 이상">60대 이상</NativeSelectOption>
        </NativeSelect>
      </div>

      {/* Interests */}
      <InterestFilter selectedInterests={selectedInterests} onInterestToggle={onInterestToggle} />
    </div>
  );
}
