import { Button } from "@/components/ui/button";
import WordPullUp from "@/components/ui/word-pull-up";
import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col py-10 bg-outerCard gap-5 md:gap-10">
      <section className="flex flex-col lg:flex-row items-center justify-center lg:items-start gap-5 lg:px-10 px-5">
        <div className="rounded-full w-96 h-72 md:h-80 bg-[#0b393b] rounded-b-none shadow-md shadow-green-400 relative">
          <img src="/logo.svg" alt="landing-bg" className="w-full h-52 xl:h-96 object-contain animate-bounce-less absolute bottom-0 xl:-mb-16" />
        </div>
        <div className="py-5 lg:px-8 sm:px-6 px-6 rounded-2xl border-lightYellow border">
          <section className="font-medium w-full max-w-lg md:max-w-2xl text-lightYellow flex flex-col gap-6 lg:text-center">
            <WordPullUp
              className="text-start lg:text-center xl:text-6xl lg:text-5xl sm:text-4xl text-4xl font-medium tracking-[-0.02em] md:text-6xl md:leading-[4rem]"
              words="Changing the way you track your habits"
            />
            <p className="lg:leading-[2rem] sm:leading-[1.5rem] leading-[1.5rem] lg:text-md sm:text-sm text-sm">
              Tribbit is a habit tracking app that helps you build good habits. With
              Tribbit, you can easily track your progress and see how you are doing over time. 
              It's easy to use and free. Track your habits today!
            </p>

            <Link to="/login" className="flex justify-start">
              <Button
                variant="outline"
                size='lg'
                className="lg:py-6 sm:py-4 py-4 px-8 rounded-md border-lightYellow hover:bg-lightYellow hover:text-outerCard"
              >
                Get started
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          </section>
        </div>
      </section>
      <section className="h-96 w-full max-w-7xl bg-lightYellow mx-auto rounded-md">

      </section>
    </div>
  );
};

export default LandingPage;
