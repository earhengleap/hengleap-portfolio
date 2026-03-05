import React, { useEffect, useRef } from "react";
import { FilePlus, FolderPlus, Edit2, Trash2 } from "lucide-react";

export interface ExplorerContextMenuProps {
    x: number;
    y: number;
    itemRef?: { path: string; name: string; isVirtual?: boolean; isFolder?: boolean } | null;
    onClose: () => void;
    onNewFile: (parentId?: string) => void;
    onNewFolder: (parentId?: string) => void;
    onRename: (path: string, currentName: string) => void;
    onDelete: (path: string, isFolder?: boolean) => void;
}

export function ExplorerContextMenu({
    x,
    y,
    itemRef,
    onClose,
    onNewFile,
    onNewFolder,
    onRename,
    onDelete,
}: ExplorerContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        // Use timeout to prevent immediate close if the event bubbled
        const timeoutId = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("contextmenu", handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("contextmenu", handleClickOutside);
        };
    }, [onClose]);

    // Ensure menu stays within screen bounds
    const safeX = Math.min(x, typeof window !== 'undefined' ? window.innerWidth - 200 : x);
    const safeY = Math.min(y, typeof window !== 'undefined' ? window.innerHeight - 200 : y);

    const isBuiltInFolder = itemRef && !itemRef.isVirtual && itemRef.isFolder;

    return (
        <div
            ref={menuRef}
            className="fixed z-[1000] w-48 bg-[#1e1e1e] text-gray-300 border border-[#333] shadow-2xl py-1 rounded text-sm animate-in fade-in zoom-in-95 duration-100"
            style={{ top: safeY, left: safeX }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            {/* Creation Section */}
            {!isBuiltInFolder ? (
                <>
                    <button
                        className="w-full flex items-center px-4 py-1.5 hover:bg-blue-600 hover:text-white transition-colors text-left"
                        onClick={() => { onNewFile(itemRef?.isFolder ? itemRef.path : undefined); onClose(); }}
                    >
                        <FilePlus className="w-4 h-4 mr-3" />
                        <span>New File...</span>
                    </button>
                    <button
                        className="w-full flex items-center px-4 py-1.5 hover:bg-blue-600 hover:text-white transition-colors text-left"
                        onClick={() => { onNewFolder(itemRef?.isFolder ? itemRef.path : undefined); onClose(); }}
                    >
                        <FolderPlus className="w-4 h-4 mr-3" />
                        <span>New Folder...</span>
                    </button>
                </>
            ) : (
                <div className="px-4 py-2 text-xs text-gray-500 italic">
                    Built-in folder cannot be modified
                </div>
            )}

            {/* Modification Section */}
            {itemRef && (
                <>
                    {!isBuiltInFolder && <div className="h-[1px] bg-[#333] my-1 mx-2" />}

                    {itemRef.isVirtual ? (
                        <>
                            <button
                                className="w-full flex items-center px-4 py-1.5 hover:bg-blue-600 hover:text-white transition-colors text-left"
                                onClick={() => { onRename(itemRef.path, itemRef.name); onClose(); }}
                            >
                                <Edit2 className="w-4 h-4 mr-3" />
                                <span>Rename</span>
                            </button>
                            <button
                                className="w-full flex items-center px-4 py-1.5 hover:bg-red-600 hover:text-white transition-colors text-left"
                                onClick={() => { onDelete(itemRef.path, itemRef.isFolder); onClose(); }}
                            >
                                <Trash2 className="w-4 h-4 mr-3" />
                                <span>Delete</span>
                            </button>
                        </>
                    ) : (
                        itemRef.isFolder ? null : (
                            <div className="px-4 py-1.5 text-xs text-gray-500 italic cursor-not-allowed">
                                Built-in file cannot be modified
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}
