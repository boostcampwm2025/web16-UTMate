'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryState, parseAsString, parseAsArrayOf, parseAsInteger } from 'nuqs';

import { Interest } from '@/features/(auth)/types/persona';
import type { Gender, AgeGroup } from '@/features/(auth)/types/persona';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';

import { SearchResultDetail } from './SearchResultDetail';
import { searchTests } from '../api/client';
import { SearchFilter } from './SearchFilter';
import { TestSearchResultItem } from './TestSearchResultItem';
import { NumberlessPaginationWithText } from './NumberlessPagiantion';
import { PersonaButton } from './PersonaButton';
import type { SearchTestResult } from '../types';

export function TestSearchPage() {
  const [selectedTest, setSelectedTest] = useState<SearchTestResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [gender, setGender] = useQueryState('gender', parseAsString);
  const [ageGroup, setAgeGroup] = useQueryState('age', parseAsString);
  const [interests, setInterests] = useQueryState(
    'interests',
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const { data, isPending, isError } = useQuery({
    queryKey: ['tests', { gender, ageGroup, interests, page }],
    queryFn: () => {
      return searchTests({
        gender: (gender as Gender) || undefined,
        age: (ageGroup as AgeGroup) || undefined,
        interests: interests as Interest[],
        page,
        limit: 9,
      });
    },
  });

  const handleGenderChange = (value: Gender | undefined) => {
    setGender(value || null).then(() => setPage(1));
  };

  const handleAgeGroupChange = (value: AgeGroup | undefined) => {
    setAgeGroup(value || null).then(() => setPage(1));
  };

  const handleInterestToggle = (interest: Interest) => {
    const newInterests = interests.includes(interest.toString())
      ? interests.filter((i) => i !== interest.toString())
      : [...interests, interest.toString()];

    setInterests(newInterests).then(() => setPage(1));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleTestClick = (test: SearchTestResult) => {
    setSelectedTest(test);
    setIsOpen(true);
  };

  return (
    <main className="h-full w-full bg-gray-50 p-4">
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <h1 className="text-2xl font-semibold text-gray-800">테스트 탐색</h1>
          <p className="text-muted-foreground">당신을 기다리고 있는 UT를 찾아보세요.</p>
        </div>

        {/* Filters */}
        <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
          <SearchFilter
            gender={(gender as Gender) || undefined}
            ageGroup={(ageGroup as AgeGroup) || undefined}
            selectedInterests={interests as Interest[]}
            onGenderChange={handleGenderChange}
            onAgeGroupChange={handleAgeGroupChange}
            onInterestToggle={handleInterestToggle}
          />
          <PersonaButton />
        </div>

        {/* Main Content */}
        <div className="w-full">
          {isPending ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted h-[300px] animate-pulse rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-muted-foreground py-20 text-center">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : data?.tests.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-medium">검색 결과가 없습니다.</p>
              <p className="text-muted-foreground mt-1">다른 검색 조건을 시도해보세요.</p>
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.tests.map((test) => (
                  <TestSearchResultItem
                    key={test.id}
                    test={test}
                    onClick={() => handleTestClick(test)}
                  />
                ))}
              </div>

              {data?.totalPage && (
                <NumberlessPaginationWithText
                  currentPage={page}
                  totalPages={data.totalPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="p-6 sm:max-w-[600px]">
            {selectedTest && <SearchResultDetail test={selectedTest} />}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
