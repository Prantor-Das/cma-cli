"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Person from "../Person";
import {
    PRASOON_LINKS,
    PRANTOR_LINKS,
    GOOGLE_FORM,
    GITHUB_ISSUE_REPORT,
} from "@/context/constants";
import Link from "next/link";

const Footer = () => {
    const [openId, setOpenId] = useState(null);

    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between gap-8 ml-0 sm:ml-8 md:ml-0">
                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold jetbrains-font">
                                cma-cli
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                                Scaffold your MERN stack project in seconds.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Built with{" "}
                                <Heart className="inline-block w-5 h-5 fill-red-500 animate-bounce text-red-500" />{" "}
                                by
                            </p>
                            <Person
                                id="prasoon"
                                image={PRASOON_LINKS.img}
                                alt="Prasoon"
                                links={PRASOON_LINKS}
                                openId={openId}
                                setOpenId={setOpenId}
                            />
                            <Person
                                id="prantor"
                                image={PRANTOR_LINKS.img}
                                alt="Prantor"
                                links={PRANTOR_LINKS}
                                openId={openId}
                                setOpenId={setOpenId}
                            />
                        </div>
                    </div>
                    <div className="md:text-right">
                        <h3 className="text-lg font-bold space-font">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    href={GOOGLE_FORM}
                                    target="_blank"
                                    className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                >
                                    Feedback
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={GITHUB_ISSUE_REPORT}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                >
                                    Report an issue
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="mailto:create.mern.app.cli@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                >
                                    Mail Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-4 text-center text-zinc-500 dark:text-zinc-400">
                    <p>
                        &copy; {new Date().getFullYear()} cma-cli. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
