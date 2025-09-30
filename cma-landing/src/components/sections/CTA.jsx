import { CodeBlock } from "../CodeBlock";

const CTA = () => {
    return (
        <section className="py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to build?</h2>
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
