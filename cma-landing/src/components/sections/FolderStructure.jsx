import { Folder, FileCode, FileJson } from "lucide-react";

const FolderStructure = () => {
    return (
        <section className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Folder Structure
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                    A well-organized template to keep your code clean.
                </p>
            </div>
            <div className="max-w-4xl mx-auto bg-zinc-100 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 rounded-2xl p-3 sm:p-6 font-mono text-sm">
                <div className="flex items-center mb-4">
                    <Folder size={18} className="mr-2" />
                    <span className="font-bold">my-mern-app/</span>
                </div>
                <div className="grid md:grid-cols-2 gap-8 pl-6">
                    <div>
                        <div className="flex items-center mt-2">
                            <Folder size={18} className="mr-2 text-blue-500" />
                            <span className="font-semibold">client/</span>
                            <span className="ml-2 text-zinc-500 dark:text-zinc-400 text-xs italic">
                                # React + Vite
                            </span>
                        </div>
                        <div className="pl-8 border-l border-zinc-300 dark:border-zinc-600 ml-2">
                            <div className="flex items-center mt-2">
                                <Folder size={16} className="mr-2" />
                                <span>public/</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <Folder size={16} className="mr-2" />
                                <span>src/</span>
                            </div>
                            <div className="pl-8 border-l border-zinc-300 dark:border-zinc-600 ml-2">
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>assets/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>components/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>config/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>context/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>hooks/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>pages/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>utils/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <FileCode size={16} className="mr-2" />
                                    <span>App.jsx</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <FileCode size={16} className="mr-2" />
                                    <span>global.css</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <FileCode size={16} className="mr-2" />
                                    <span>Layout.jsx</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <FileCode size={16} className="mr-2" />
                                    <span>main.jsx</span>
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileCode size={16} className="mr-2" />
                                <span>eslint.config.js</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileCode size={16} className="mr-2" />
                                <span>index.html</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileJson size={16} className="mr-2" />
                                <span>package.json</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileCode size={16} className="mr-2" />
                                <span>tailwind.config.js</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileCode size={16} className="mr-2" />
                                <span>vite.config.js</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mt-2">
                            <Folder size={18} className="mr-2 text-green-500" />
                            <span className="font-semibold">server/</span>
                            <span className="ml-2 text-zinc-500 dark:text-zinc-400 text-xs italic">
                                # Node.js + Express
                            </span>
                        </div>
                        <div className="pl-8 border-l border-zinc-300 dark:border-zinc-600 ml-2">
                            <div className="flex items-center mt-2">
                                <Folder size={16} className="mr-2" />
                                <span>src/</span>
                            </div>
                            <div className="pl-8 border-l border-zinc-300 dark:border-zinc-600 ml-2">
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>config/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>middleware/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>models/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>routes/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>__tests__/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Folder size={16} className="mr-2" />
                                    <span>utils/</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <FileCode size={16} className="mr-2" />
                                    <span>server.js</span>
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileCode size={16} className="mr-2" />
                                <span>eslint.config.js</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileJson size={16} className="mr-2" />
                                <span>package.json</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <FileCode size={16} className="mr-2" />
                                <span>vitest.config.js</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pl-6 mt-4">
                    <div className="flex items-center mt-2">
                        <FileJson size={18} className="mr-2" />
                        <span>package.json</span>
                    </div>
                    <div className="flex items-center mt-2">
                        <FileCode size={18} className="mr-2" />
                        <span>README.md</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FolderStructure;
