import React, { useState, useRef, useEffect, ForwardedRef } from 'react';
import "@mdxeditor/editor/style.css";
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditorMethods,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    MDXEditorProps,
    BlockTypeSelect,
    CodeToggle,
    CreateLink,
    InsertImage,
    imagePlugin,
    InsertTable,
    tablePlugin,
    ListsToggle,
    linkDialogPlugin,
    InsertFrontmatter,
    frontmatterPlugin,
} from '@mdxeditor/editor';
import './MDXEditor.css';

interface MyMDXEditorProps extends MDXEditorProps {
    editorRef?: ForwardedRef<MDXEditorMethods>;
}

const MyMDXEditor: React.FC<MyMDXEditorProps> = ({ editorRef, ...props }) => {
    const [toolkitPosition, setToolkitPosition] = useState<{ x: number; y: number } | null>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);

    const handleSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && editorContainerRef.current) {
            const range = selection.getRangeAt(0);
            if (!editorContainerRef.current.contains(range.commonAncestorContainer)) {
                setToolkitPosition(null);
                return;
            }
            if (!range.collapsed) {
                const rect = range.getBoundingClientRect();
                setToolkitPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY - 40 });
                const selectedText = selection.toString();
                fetch("http://127.0.0.1:8000/api/save-selection/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ selectedText }),
                });
            } else {
                setToolkitPosition(null);
            }
        }
    };

    useEffect(() => {
        const editor = editorContainerRef.current;
        if (editor) {
            editor.addEventListener('mouseup', handleSelection);
            editor.addEventListener('keyup', handleSelection);
        }
        return () => {
            if (editor) {
                editor.removeEventListener('mouseup', handleSelection);
                editor.removeEventListener('keyup', handleSelection);
            }
        };
    }, [editorContainerRef]);

    return (
        <div className="mdx-editor-container" ref={editorContainerRef} style={{ position: 'relative' }}>
            <MDXEditor
                contentEditableClassName="MDXEditor-content"
                plugins={[
                    toolbarPlugin({
                        toolbarContents: () => (
                            <div className="my-toolbar">
                                <div className="toolbar-item UndoRedo">
                                    <UndoRedo />
                                </div>
                                <div className="toolbar-item BoldItalicUnderlineToggles">
                                    <BoldItalicUnderlineToggles />
                                </div>
                                <div className="toolbar-item">
                                    <InsertFrontmatter />
                                </div>
                                <div className="toolbar-item">
                                    <ListsToggle />
                                </div>
                                <div className="toolbar-item">
                                    <InsertTable />
                                </div>
                                <div className="toolbar-item">
                                    <InsertImage />
                                </div>
                                <div className="toolbar-item">
                                    <CreateLink />
                                </div>
                                <div className="toolbar-item">
                                    <CodeToggle />
                                </div>
                                <div className="toolbar-item">
                                    <BlockTypeSelect />
                                </div>
                            </div>
                        ),
                    }),
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    imagePlugin(),
                    tablePlugin(),
                    linkDialogPlugin(),
                    frontmatterPlugin(),
                ]}
                {...props}
                ref={editorRef}
            />

            {/* Display the toolkit only when text is selected within the editor */}
            {toolkitPosition && (
                <div
                    className="floating-toolkit"
                    style={{
                        position: 'absolute',
                        top: toolkitPosition.y,
                        left: toolkitPosition.x,
                        zIndex: 1000,
                        background: '#fff',
                        border: '1px solid #ccc',
                        padding: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    {/* Customize your toolkit actions here */}
                    <button onClick={() => console.log('Bold')}>Bold</button>
                    <button onClick={() => console.log('Italic')}>Italic</button>
                    <button onClick={() => console.log('Link')}>Link</button>
                    {/* Add more actions as needed */}
                </div>
            )}
        </div>
    );
};

export default MyMDXEditor;
