import { ChevronRight } from "lucide-react";

const DocumentationCard = ({ icon: Icon, title, items }) => (
    <div className="rounded-xl border bg-white border-zinc-200 dark:bg-zinc-900/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <Icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                    {title}
                </h3>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-x-hidden"
                    >
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-900 dark:text-zinc-100">
                                    {item.title}
                                </span>
                                {item.code && (
                                    <code className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded font-mono border border-zinc-300 dark:border-zinc-600">
                                        {item.code}
                                    </code>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default DocumentationCard;
