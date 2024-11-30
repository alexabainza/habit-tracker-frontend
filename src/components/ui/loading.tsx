import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

type LoadingProps = {
  className?: string;
  loaderClassName?: string;
};

const Loading: React.FC<LoadingProps> = ({ className, loaderClassName }) => {
  return (
    <div
      className={cn(
        className,
        "text-center text-lg text-lightYellow inline-flex flex-col items-center justify-center gap-2 p-5 mx-auto"
      )}
    >
      <LoaderIcon className={cn(loaderClassName, "w-8 h-8 animate-spin")} />
      Loading...
    </div>
  );
};

export default Loading;
