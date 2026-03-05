import {
    FileCode2,
    FileJson,
    FileText,
    Settings,
    Image as ImageIcon,
    FileAudio,
    FileVideo,
    Archive,
    TerminalSquare,
    Database,
    Binary,
    FileWarning,
    FileSpreadsheet,
    File,
    Code2
} from "lucide-react";

export function getFileIconAndColor(filename: string) {
    const ext = filename.split('.').pop()?.toLowerCase();

    switch (ext) {
        case 'js':
        case 'jsx':
            return { icon: FileCode2, color: "text-yellow-400" };
        case 'ts':
        case 'tsx':
            return { icon: FileCode2, color: "text-blue-400" };
        case 'json':
            return { icon: FileJson, color: "text-green-400" };
        case 'html':
        case 'htm':
            return { icon: Code2, color: "text-orange-500" };
        case 'css':
        case 'scss':
        case 'sass':
            return { icon: Code2, color: "text-blue-500" };
        case 'md':
        case 'mdx':
            return { icon: FileText, color: "text-sky-300" };
        case 'env':
            return { icon: Settings, color: "text-gray-400" };
        case 'sh':
        case 'bash':
        case 'zsh':
            return { icon: TerminalSquare, color: "text-green-500" };
        case 'py':
            return { icon: FileCode2, color: "text-yellow-300" };
        case 'go':
            return { icon: FileCode2, color: "text-cyan-400" };
        case 'rs':
            return { icon: Binary, color: "text-orange-400" };
        case 'java':
        case 'jar':
        case 'class':
            return { icon: FileCode2, color: "text-red-400" };
        case 'c':
        case 'cpp':
        case 'h':
        case 'hpp':
            return { icon: FileCode2, color: "text-blue-600" };
        case 'sql':
            return { icon: Database, color: "text-blue-300" };
        case 'csv':
        case 'xlsx':
        case 'xls':
            return { icon: FileSpreadsheet, color: "text-green-600" };
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
        case 'webp':
        case 'ico':
            return { icon: ImageIcon, color: "text-purple-400" };
        case 'mp3':
        case 'wav':
        case 'ogg':
            return { icon: FileAudio, color: "text-yellow-500" };
        case 'mp4':
        case 'webm':
        case 'avi':
            return { icon: FileVideo, color: "text-purple-500" };
        case 'zip':
        case 'tar':
        case 'gz':
        case 'rar':
            return { icon: Archive, color: "text-red-500" };
        case 'log':
            return { icon: FileWarning, color: "text-gray-500" };
        case 'txt':
            return { icon: FileText, color: "text-gray-300" };
        default:
            return { icon: File, color: "text-gray-400" };
    }
}
