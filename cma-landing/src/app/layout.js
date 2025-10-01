import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

export const metadata = {
    title: "cma-cli - Create MERN App",
    description:
        "A simple and powerful CLI tool to scaffold a modern MERN stack application with a single command.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`antialiased bg-zinc-50 dark:bg-zinc-950`}>
                <Providers>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
