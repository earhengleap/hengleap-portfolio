import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { FileJson, FileType, Code, Type, File as FileIcon } from "lucide-react";

export default function FileViewer({ params }: { params: { slug?: string[] } }) {
    if (!params.slug || params.slug.length === 0) {
        return notFound();
    }

    // Secure the path to prevent directory traversal
    const safeSlug = params.slug.filter(s => s !== ".." && s !== ".");
    const filePath = path.join(process.cwd(), ...safeSlug);

    if (!fs.existsSync(filePath)) {
        return notFound();
    }

    try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            return (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Cannot open a directory. Please select a file.
                </div>
            );
        }

        const content = fs.readFileSync(filePath, "utf-8");
        const fileName = safeSlug[safeSlug.length - 1];
        const ext = path.extname(fileName).toLowerCase();

        // Basic icon determination
        let Icon = FileIcon;
        let colorClass = "text-gray-400";
        if (ext === ".ts" || ext === ".tsx") { Icon = Type; colorClass = "text-blue-400"; }
        else if (ext === ".json") { Icon = FileJson; colorClass = "text-green-400"; }
        else if (ext === ".css") { Icon = Code; colorClass = "text-pink-400"; }
        else if (ext === ".md") { Icon = FileType; colorClass = "text-purple-400"; }

        return (
            <div className="w-full h-full flex flex-col font-mono text-sm animate-in fade-in duration-300">
                <div className="flex items-center text-gray-400 mb-4 pb-2 border-b border-[#333]/50">
                    <Icon className={`w-4 h-4 mr-2 ${colorClass}`} />
                    <span className="text-gray-500 mr-2">{"{ }"}</span>
                    {safeSlug.join(" / ")}
                </div>
                <div className="flex-1 overflow-auto rounded pb-8 custom-scrollbar">
                    <pre className="text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
                        <code>{content}</code>
                    </pre>
                </div>
            </div>
        );
    } catch (e) {
        return (
            <div className="w-full h-full flex items-center justify-center text-red-500/80">
                Error reading file: {e instanceof Error ? e.message : "Unknown error"}
            </div>
        );
    }
}
