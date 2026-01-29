import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

interface NumberlessPaginationWithTextProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const NumberlessPaginationWithText = ({
  currentPage,
  totalPages,
  onPageChange,
}: NumberlessPaginationWithTextProps) => {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={`border ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            <span className="text-foreground">{currentPage}</span> of{' '}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            className={`border ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
