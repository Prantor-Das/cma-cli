import { CodeBlock } from "../CodeBlock";
import Image from "next/image";
import { CMA_IMG } from "@/context/constants";

const Hero = () => {
    return (
        <div className="max-h-screen w-full relative">
            {/* Dashed Top Fade Grid */}
            <div
                className="absolute -inset-2 z-0 max-h-screen block dark:hidden lg:hidden"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #C9C9C9 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                    backgroundSize: "30px 30px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 5%, #000 60%, transparent 100%)
      `,
                    WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 5%, #000 60%, transparent 100%)
      `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />

            <div
                className="absolute -inset-2 z-0 max-h-screen hidden dark:block lg:dark:hidden"
                style={{
                    backgroundImage: `
      linear-gradient(to right, #323232 1px, transparent 1px),
      linear-gradient(to bottom, #212121 1px, transparent 1px)
    `,
                    backgroundSize: "30px 30px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
      repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      radial-gradient(ellipse 70% 60% at 50% 5%, #000 60%, transparent 100%)
    `,
                    WebkitMaskImage: `
      repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      radial-gradient(ellipse 70% 60% at 50% 5%, #000 60%, transparent 100%)
    `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                    backgroundColor: "#0a0a0a",
                }}
            />

            <section className="text-center py-24  flex flex-col justify-center items-center space-y-8 relative overflow-x-hidden">
                <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold space-font">
                    Skip the Boilerplate, <br />
                    Start Building
                </h1>
                <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                    Stop wasting time on boilerplate.{" "}
                    <span className="font-mono">cma-cli</span> scaffolds a
                    modern MERN stack application with everything you need to
                    get started.
                </p>
                <div className="mt-12 w-full max-w-sm md:max-w-lg lg:max-w-xl">
                    <CodeBlock code="npx cma-cli" />
                </div>
                <Image
                    src={CMA_IMG}
                    alt="Hero"
                    width={500}
                    height={500}
                    className="mix-blend-difference absolute -rotate-90 -left-100 md:-left-80 lg:-left-45 xl:scale-110 opacity-50"
                />
                <Image
                    src={CMA_IMG}
                    alt="Hero"
                    width={500}
                    height={500}
                    className="absolute rotate-90 -right-100 md:-right-80 lg:-right-45 xl:scale-110 mix-blend-difference opacity-50"
                />
            </section>
        </div>
    );
};

export default Hero;
