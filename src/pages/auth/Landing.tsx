import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import WordPullUp from "@/components/ui/word-pull-up";
import { ArrowRightIcon } from "lucide-react";
import React from "react";
const LandingPage: React.FC = () => {
  return (
    <div className="items-start px-16 ">
      <Navbar />
      <div className="bg-[var(--color-background)] py-40 px-8 rounded-2xl">
        <section className="font-medium w-1/2 text-[var(--color-primary)] flex flex-col gap-6">
          <WordPullUp
            className="text-xl text-start font-medium tracking-[-0.02em] md:text-6xl md:leading-[4rem]"
            words="Changing the way you track your habits"
          />
          <p className="leading-[2rem] text-md">
            Libero nullam. Proin doloribus excepturi penatibus elit ea sed
            rerum, penatibus sagittis. Adipisicing eu, suscipit iusto dignissim
            voluptatum! Taciti deserunt.
          </p>

          <div className="flex justify-start">
            <Button
              variant="outline"
              className="py-6 px-8 rounded-full border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            >
              Get started
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
