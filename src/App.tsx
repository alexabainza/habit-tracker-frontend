import { Button } from "./components/ui/button";
import WordPullUp from "./components/ui/word-pull-up";

function App() {
  return (
    <>
      <WordPullUp
        className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
        words="Welcome to my youtube channel"
      />
      <Button variant="outline">click if you love pcy</Button>
    </>
  );
}

export default App;
