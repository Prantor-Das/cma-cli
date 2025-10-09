import { CodeBlock } from "../CodeBlock";

const CTA = () => {
    return (
        <section className="pt-20 pb-30 text-center">
            <h2 className="text-3xl md:text-5xl font-bold space-font">
                Ready to build?
            </h2>
            <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                Get your next MERN project up and running in under a minute.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
                <CodeBlock code="npx cma-cli" />
            </div>
        </section>
    );
};

export default CTA;
