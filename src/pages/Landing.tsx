import { Button } from "@/components/ui/button";
import WordPullUp from "@/components/ui/word-pull-up";
import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
const LandingPage: React.FC = () => {
  return (
    <div className="items-start lg:px-16 sm:px-5 px-5 ">
      <div className="mt-8 bg-[var(--color-background)] lg:py-40 sm:py-12 py-12 lg:px-8 sm:px-6 px-6 rounded-2xl">
        <section className="font-medium lg:w-1/2 sm:w-full w-full text-[var(--color-primary)] flex flex-col gap-6">
          <WordPullUp
            className="lg:text-6xl sm:text-4xl text-4xl text-start font-medium tracking-[-0.02em] md:text-6xl md:leading-[4rem]"
            words="Changing the way you track your habits"
          />
          <p className="lg:leading-[2rem] sm:leading-[1.5rem] leading-[1.5rem] lg:text-md sm:text-sm text-sm">
            Libero nullam. Proin doloribus excepturi penatibus elit ea sed
            rerum, penatibus sagittis. Adipisicing eu, suscipit iusto dignissim
            voluptatum! Taciti deserunt.
          </p>

          <Link to="/login" className="flex justify-start">
            <Button
              variant="outline"
              className="lg:py-6 sm:py-4 py-4 px-8 rounded-full border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            >
              Get started
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
