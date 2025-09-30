import {CodeBlock} from '../CodeBlock';
import Image from 'next/image';

const Hero = () => {
  return (
      <section className="text-center py-20  flex flex-col justify-center items-center space-y-8 relative">
          <h1 className="text-4xl md:text-6xl font-bold">
              Skip the Boilerplate, <br />
              Start Building
          </h1>
          <p className="mt-4 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Stop wasting time on boilerplate.{" "}
              <span className="font-mono">cma-cli</span> scaffolds a modern MERN
              stack application with everything you need to get started.
          </p>
          <div className="mt-8 w-full max-w-xs md:max-w-md lg:max-w-lg">
              <CodeBlock code="npx cma-cli" />
          </div>
          <Image
              src="/image.png"
              alt="Hero"
              width={500}
              height={500}
              className="mix-blend-difference absolute -rotate-90 -left-100 md:-left-80 lg:-left-50 scale-110"
          />
          <Image
              src="/image.png"
              alt="Hero"
              width={500}
              height={500}
              className="mix-blend-difference absolute rotate-90 -right-100 md:-right-80 lg:-right-50 scale-110"
          />
      </section>
  );
};

export default Hero;
