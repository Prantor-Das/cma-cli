import { CodeBlock } from "../CodeBlock";
import Image from "next/image";
import { CMA_IMG } from "@/context/constants";

const Hero = () => {
    return (
        <section className="text-center py-24  flex flex-col justify-center items-center space-y-8 relative overflow-x-hidden">
            <h1 className="text-4xl md:text-6xl font-bold">
                Skip the Boilerplate, <br />
                Start Building
            </h1>
            <p className="mt-4 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                Stop wasting time on boilerplate.{" "}
                <span className="font-mono">cma-cli</span> scaffolds a modern
                MERN stack application with everything you need to get started.
            </p>
            <div className="mt-8 w-full max-w-xs md:max-w-md lg:max-w-lg">
                <CodeBlock code="npx cma-cli" />
            </div>
            <Image
                src={CMA_IMG}
                alt="Hero"
                width={500}
                height={500}
                className="mix-blend-difference absolute -rotate-90 -left-100 md:-left-80 lg:-left-45 scale-110 opacity-50"
            />
            <Image
                src={CMA_IMG}
                alt="Hero"
                width={500}
                height={500}
                className="absolute rotate-90 -right-100 md:-right-80 lg:-right-45 scale-110 mix-blend-difference opacity-50"
            />
        </section>
    );
};

export default Hero;
