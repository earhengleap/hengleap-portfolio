import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define which directories to search within the project
const SEARCH_DIRS = ["app", "components", "lib"];
const IGNORE_DIRS = ["node_modules", ".git", ".next"];

function searchFilesRecursively(dir: string, query: string, results: any[]) {
    if (results.length >= 50) return; // Limit results

    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (results.length >= 50) break;

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                searchFilesRecursively(fullPath, query, results);
            }
        } else {
            // Only search text files (rough check based on extension)
            const ext = path.extname(file);
            if (![".ts", ".tsx", ".js", ".jsx", ".md", ".json", ".css"].includes(ext)) {
                continue;
            }

            try {
                const content = fs.readFileSync(fullPath, "utf-8");
                const lowerContent = content.toLowerCase();
                const lowerQuery = query.toLowerCase();

                const index = lowerContent.indexOf(lowerQuery);

                if (index !== -1) {
                    // We found a match in the file content
                    // Extract a snippet around the match
                    const start = Math.max(0, index - 40);
                    const end = Math.min(content.length, index + query.length + 40);
                    let snippet = content.substring(start, end).replace(/\n/g, " ");

                    if (start > 0) snippet = "..." + snippet;
                    if (end < content.length) snippet = snippet + "...";

                    // The path returned should be relative to the project root, so we can route to it
                    // e.g., "components/ui/button.tsx"
                    const relativePath = fullPath.replace(process.cwd() + path.sep, "").replace(/\\/g, "/");

                    // Next.js <Link> crashes if we pass unencoded `[` or `]` in the href.
                    const safePath = relativePath.split("/").map(encodeURIComponent).join("/");

                    results.push({
                        title: file,
                        path: `/files/${safePath}`,
                        description: snippet,
                        content: snippet
                    });
                }
            } catch (e) {
                // Ignore read errors
            }
        }
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
        return NextResponse.json([]);
    }

    const results: any[] = [];
    const cwd = process.cwd();

    for (const dir of SEARCH_DIRS) {
        const fullDir = path.join(cwd, dir);
        if (fs.existsSync(fullDir)) {
            searchFilesRecursively(fullDir, query, results);
            if (results.length >= 50) break;
        }
    }

    return NextResponse.json(results);
}
