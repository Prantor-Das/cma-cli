"use client";
import { Terminal, Code, Layers, Moon, ServerCog, Rocket } from "lucide-react";
import { CONCURRENTLY_IMG, MERN_IMG } from "@/context/constants";

const features = [
    {
        title: "Interactive CLI",
        description:
            "Command-line interface for guided and customizable app scaffolding.",
        icon: Terminal,
        gridClass: "span-col-2",
    },
    {
        title: "JavaScript & TypeScript",
        description:
            "Choose your preferred language with full TypeScript support for type safety.",
        icon: Code,
        gridClass: "span-col-1",
    },
    {
        title: "Modern Stack (React 18, Node.js, Express)",
        description:
            "Up-to-date technologies ensuring powerful, maintainable full-stack development.",
        icon: Layers,
        gridClass: "span-col-1 span-row-3",
        image: MERN_IMG,
    },
    {
        title: "Concurrent Workspace",
        description:
            "Run client and server simultaneously with Concurrently, streamlining development in a unified workspace.",
        icon: Terminal,
        gridClass: "span-row-2",
        image: CONCURRENTLY_IMG,
    },
    {
        title: "Example API Endpoints",
        description:
            "Ready-to-use API routes demonstrating best practices and integration.",
        icon: ServerCog,
        gridClass: "span-col-2",
    },
    {
        title: "Pre-configured Dark Mode",
        description:
            "Built-in dark theme support for improved usability and aesthetics.",
        icon: Moon,
        gridClass: "span-col-1",
    },
    {
        title: "Ready for Production",
        description:
            "Optimized and secure setup with deployment best practices included.",
        icon: Rocket,
        gridClass: "span-col-1",
    },
];

const Features = () => (
    <section className="py-20 max-w-6xl mx-auto" id="features">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
                Packed with Features
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                Everything you need for a great developer experience.
            </p>
        </div>
        <div className="features-grid-bento">
            {features.map(
                (
                    { title, description, icon: Icon, gridClass, image },
                    index,
                ) => (
                    <div
                        key={index}
                        className={`feature-card-masonry ${gridClass} dark:text-zinc-100 p-4 lg:p-0 rounded-2xl
                shadow-[0_4px_12px_rgba(0,0,0,0.07)]
                hover:shadow-[0px_10px_20px_rgba(0,0,0,0.15)]
                border border-transparent dark:border-zinc-800
                bg-white/80 dark:bg-zinc-900/80
                dark:hover:shadow-[0px_10px_20px_rgba(255,_255,_255,_0.05)] flex flex-col
            `}
                        style={{
                            transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.transform =
                                "perspective(600px) rotateX(10deg) rotateY(2.5deg) scale(1.03)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "none")
                        }
                    >
                        <Icon className="w-8 h-8 mb-3 text-green-600 dark:text-green-400 lg:mx-4 lg:mt-4" />
                        <p className="text-lg font-semibold mb-2 px-4">
                            {title}
                        </p>
                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 lg:px-4 lg:pb-4">
                            {description}
                        </p>
                        {image && (
                            <img
                                src={image}
                                alt={title}
                                className="mt-auto rounded-b-2xl shadow-md w-full h-full object-cover hidden lg:block "
                            />
                        )}
                    </div>
                ),
            )}
        </div>
    </section>
);

export default Features;
