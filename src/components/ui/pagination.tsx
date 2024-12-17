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
        "flex items-center justify-center gap-4 text-lightYellow w-full z-50",
        className
      )}
    >
      <Button
        className="bg-innermostCard hover:bg-innermostCard/90 transition-all duration-300"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        <span>Prev</span>
      </Button>
      <span>
        {page} of {totalPages}
      </span>
      <Button
        className="bg-innermostCard hover:bg-innermostCard/90 transition-all duration-300"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        <span>Next</span>
        <ChevronRightIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Pagination;
