'use client';

import { useCallback, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Interest } from '@/features/(auth)/types/persona';
import type { Gender, AgeGroup } from '@/features/(auth)/types/persona';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';

import { SearchResultDetail } from './SearchResultDetail';
import { searchTests } from '../api/client';
import { SearchFilter } from './SearchFilter';
import { TestSearchResultItem } from './TestSearchResultItem';
import { NumberlessPaginationWithText } from './NumberlessPagiantion';
import type { SearchTestResult } from '../types';

export function TestSearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTest, setSelectedTest] = useState<SearchTestResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Extract params from URL
  const gender = (searchParams.get('gender') as Gender) || undefined;
  const ageGroup = (searchParams.get('age') as AgeGroup) || undefined;
  const interests = searchParams.getAll('interests') as Interest[];
  const page = Number(searchParams.get('page')) || 1;

  // Fetch Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tests', { gender, ageGroup, interests, page }],
    queryFn: () => {
      return searchTests({
        gender,
        age: ageGroup,
        interests,
        page,
        limit: 9,
      });
    },
  });

  // URL Update Helper
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      // Reset page to 1 on filter change
      if (name !== 'page') {
        params.set('page', '1');
      }
      return params.toString();
    },
    [searchParams],
  );

  const toggleInterestParam = useCallback(
    (interest: Interest) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentInterests = params.getAll('interests');

      params.delete('interests');
      if (currentInterests.includes(interest.toString())) {
        currentInterests
          .filter((i) => i !== interest.toString())
          .forEach((i) => params.append('interests', i));
      } else {
        [...currentInterests, interest].forEach((i) => params.append('interests', i));
      }
      params.set('page', '1');
      return params.toString();
    },
    [searchParams],
  );

  const handleGenderChange = (value: Gender | undefined) => {
    router.push(`${pathname}?${createQueryString('gender', value ?? null)}`);
  };

  const handleAgeGroupChange = (value: AgeGroup | undefined) => {
    router.push(`${pathname}?${createQueryString('age', value ?? null)}`);
  };

  const handleInterestToggle = (interest: Interest) => {
    router.push(`${pathname}?${toggleInterestParam(interest)}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString('page', newPage.toString())}`);
  };

  const handleTestClick = (test: SearchTestResult) => {
    setSelectedTest(test);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="flex flex-col space-y-4">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">테스트 찾기</h1>
          <p className="text-muted-foreground">당신을 기다리고 있는 UT를 찾아보세요.</p>
        </div>

        {/* Filters */}
        <section className="w-full">
          <SearchFilter
            gender={gender}
            ageGroup={ageGroup}
            selectedInterests={interests}
            onGenderChange={handleGenderChange}
            onAgeGroupChange={handleAgeGroupChange}
            onInterestToggle={handleInterestToggle}
          />
        </section>

        {/* Main Content */}
        <main className="w-full">
          {isLoading ? (
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
        </main>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="p-6 sm:max-w-[600px]">
            {selectedTest && <SearchResultDetail test={selectedTest} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
