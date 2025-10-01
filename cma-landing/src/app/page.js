import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Installation from "@/components/sections/Installation";
import FolderStructure from "@/components/sections/FolderStructure";
import CTA from "@/components/sections/CTA";

export default function page() {
    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <Hero />
            <Features />
            <Installation />
            <FolderStructure />
            <CTA />
        </div>
    );
}
