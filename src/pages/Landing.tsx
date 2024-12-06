import { Button } from "@/components/ui/button";
import WordPullUp from "@/components/ui/word-pull-up";
import { ArrowRightIcon, DumbbellIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { GiInspiration, GiFist } from "react-icons/gi";
import { ContainerScroll } from "@/components/ui/container-scroll";
import { FaGithub } from "react-icons/fa6";
import { ImageLink } from "@/components/ui/image-links";
import { LuSwords } from "react-icons/lu";

const LandingPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col pt-24 bg-outerCard gap-10">
      <DumbbellIcon className="w-[1000px] h-[1000px] text-lightYellow fixed -z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5" />
      <section className="z-50 flex flex-col lg:flex-row items-center justify-center lg:items-start gap-5 lg:px-10 px-5">
        <div className="rounded-full w-96 h-72 md:h-80 bg-[#0b393b] rounded-b-none shadow-md shadow-green-400 relative">
          <img
            loading="eager" src="/logo.svg" alt="landing-bg" className="w-full h-52 xl:h-96 object-contain animate-bounce-less absolute bottom-0 xl:-mb-16" />
        </div>
        <div className="py-5 lg:px-8 sm:px-6 px-6 rounded-2xl ">
          <section className="font-medium w-full max-w-lg md:max-w-2xl text-lightYellow flex flex-col gap-6">
            <WordPullUp
              className="text-start xl:text-6xl lg:text-5xl sm:text-4xl text-4xl font-medium tracking-[-0.02em] md:text-6xl md:leading-[4rem]"
              words="Changing the way you track your habits"
            />
            <p className="lg:leading-[2rem] sm:leading-[1.5rem] leading-[1.5rem] lg:text-md sm:text-sm text-sm text-left">
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
      <section className="z-50 xl:rounded-md md:h-[450px] w-full max-w-7xl bg-lightYellow mx-auto grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 p-5 gap-5 md:gap-8 lg:gap-10 py-10 mt-20 lg:mb-20 shadow-[4px_4px_0px_black] shadow-black">
        <div className="flex flex-col transition-all duration-300 hover:gap-8 justify-center gap-5 items-center py-0">
          <MdTrackChanges className="h-32 w-32 flex-shrink-0 text-outerCard" />
          <section className="space-y-3">
            <h2 className="text-3xl font-medium text-center text-outerCard">Track your habits</h2>
            <p className="text-base text-center font-normal text-outerCard max-w-64 md:max-w-xs">
              Tribbit allows you to track your habits and see how you are doing overtime.
            </p>
          </section>
        </div>
        <div className="flex flex-col transition-all duration-300 hover:gap-8 justify-center gap-5 items-center py-5">
          <GiInspiration className="h-32 w-32 flex-shrink-0 text-outerCard" />
          <section className="space-y-3">
            <h2 className="text-3xl font-medium text-center text-outerCard">Stay motivated</h2>
            <p className="text-base text-center font-normal text-outerCard max-w-64 md:max-w-xs">
              Tribbit helps you stay motivated, showing you how well you are doing.
            </p>
          </section>
        </div>
        <div className="flex flex-col transition-all duration-300 hover:gap-8 justify-center gap-5 items-center py-5">
          <GiFist className="h-32 w-32 flex-shrink-0 text-outerCard" />
          <section className="space-y-3">
            <h2 className="text-3xl font-medium text-center text-outerCard">Build habits</h2>
            <p className="text-base text-center font-normal text-outerCard max-w-64 md:max-w-xs">
              With Tribbit, you can easily build good habits and improve your life.
            </p>
          </section>
        </div>
      </section>
      <ContainerScroll
        className="-mb-60 md:mb-0"
        titleComponent={
          <>
            <h1 className="text-2xl md:text-4xl font-medium text-lightYellow dark:text-white">
              Check what's for today in<br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Tribbit's Dashboard
              </span>
            </h1>
          </>
        }
      >
        <img
          loading="eager"
          src="/dashboard.png"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
      <ContainerScroll
        className="-mb-24 md:mb-0"
        titleComponent={
          <>
            <h1 className="text-2xl md:text-4xl font-medium text-lightYellow dark:text-white px-1">
              Create and manipulate habits thru<br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Habit Management
              </span>
            </h1>
          </>
        }
      >
        <img
          loading="eager"
          src="/habits.png"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
      <ContainerScroll
        className="-mb-24 md:mb-0"
        titleComponent={
          <>
            <h1 className="text-2xl md:text-4xl font-medium text-lightYellow dark:text-white">
              See how you're doing by <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Insights and Analytics
              </span>
            </h1>
          </>
        }
      >
        <img
          loading="eager"
          src="/analytics.png"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
      <section className="bg-lightYellow p-4 md:px-8 md:py-16 h-[900px] lg:h-[1100px] w-full max-w-7xl mx-auto rounded-xl relative">
        <div className="py-12">
          <LuSwords className="w-28 h-28 mx-auto text-outerCard" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-outerCard text-center font-bold">
            Meet the Team
          </h1>
        </div>
        <div className="mx-auto max-w-5xl">
          <ImageLink
            heading="Mallen"
            subheading="Fullstack Developer creating fast & reliable apps"
            imgSrc="/mallen.jpg"
            href="https://github.com/jbotmallen"
          />
          <ImageLink
            heading="Alex"
            subheading="Fullstack UI/UX Developer building robust apps"
            imgSrc="/alex.jpg"
            href="https://github.com/alexabainza"
          />
          <ImageLink
            heading="Stella"
            subheading="UI/UX Designer here to make your app cute"
            imgSrc="/stella.jpg"
            href="https://www.facebook.com/stellasalde"
          />
        </div>
        <footer className="text-center bg-neutral-700 lg:text-left flex items-center justify-between px-5 md:px-16 lg:px-24 rounded-t-full pt-10 md:pt-16 absolute bottom-0 w-full left-0">
          <img
            loading="eager" src="/logo.svg" alt="logo" className="w-20 h-20 z-50" />
          <div className="p-4 text-center text-lightYellow dark:text-white font-semibold z-50">
            © 2023 Copyright:
            <a href="/"> Tribbit</a>
          </div>
          <ul className="flex items-center gap-2 z-50">
            <li className="flex-shrink-0">
              <Link to='https://github.com/alexabainza/habit-tracker-frontend'>
                <FaGithub className="w-10 h-10 text-lightYellow z-50 mr-3" />
              </Link>
            </li>
          </ul>
        </footer>
      </section>
    </div>
  );
};

export default LandingPage;
