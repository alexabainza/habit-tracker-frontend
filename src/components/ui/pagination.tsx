import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  className?: string;
};

const Pagination = ({
  page,
  totalPages,
  setPage,
  className = "",
}: PaginationProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 text-lightYellow w-full",
        className
      )}
    >
      <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
        <ChevronLeftIcon className="w-5 h-5" />
        <span>Previous</span>
      </Button>
      <span>
        {page} of {totalPages}
      </span>
      <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        <span>Next</span>
        <ChevronRightIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Pagination;
