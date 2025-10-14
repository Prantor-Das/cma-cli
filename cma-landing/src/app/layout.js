import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

import { Space_Grotesk, Figtree, JetBrains_Mono } from "next/font/google";

const space = Space_Grotesk({
    variable: "--font-space",
    subsets: ["latin"],
    display: "swap",
});

const figtree = Figtree({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-figtree",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jetbrains",
});

export const metadata = {
    title: "cma-cli",
    description:
        "A simple and powerful CLI tool to scaffold a modern MERN stack application with a single command.",
    keywords: [
        "cma-cli",
        "mern",
        "mern-stack",
        "cli-tool",
        "scaffolding",
        "template",
        "full-stack",
        "webapp",
        "react",
        "nodejs",
        "expressjs",
        "mongodb",
        "javascript",
        "typescript",
        "developer-tools",
    ],
    authors: [
        { name: "Prasoon Kumar", url: "https://prasoonk.vercel.app" },
        { name: "Prantor Das", url: "https://github.com/Prantor-Das" },
    ],
    creator: "cma-cli team",
    publisher: "cma-cli",
    robots: "index, follow",
    googlebot:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    alternates: {
        canonical: "https://cmacli.vercel.app",
    },
    applicationName: "cma-cli",
    generator: "Next.js",
    metadataBase: new URL("https://cmacli.vercel.app"),
    openGraph: {
        title: "cma-cli - Create MERN App",
        description:
            "A simple and powerful CLI tool to scaffold a modern MERN stack application with a single command.",
        url: "https://cmacli.vercel.app",
        siteName: "cma-cli",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://cmacli.vercel.app/ogBanner.png",
                width: 1200,
                height: 630,
                alt: "cma-cli OG Banner",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        creator: "@kenma_dev",
        additionalCreators: ["@akashi_sde"],
        title: "cma-cli - Create MERN App",
        description:
            "A simple and powerful CLI tool to scaffold a modern MERN stack application with a single command.",
        images: ["https://cmacli.vercel.app/ogBanner.png"],
    },
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" type="image" href="/logo.png" />
            </head>
            <body
                className={`antialiased bg-zinc-50 dark:bg-zinc-950 ${figtree.className} ${space.variable} ${jetbrainsMono.variable}`}
            >
                <Providers>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <Analytics />
                </Providers>
            </body>
        </html>
    );
}
