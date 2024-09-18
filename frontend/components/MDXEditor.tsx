// components/MDXEditor.tsx
import React, { ForwardedRef } from 'react';
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
    return (
        <div className="mdx-editor-container">
            <MDXEditor
                contentEditableClassName="MDXEditor-content w-4/5 mx-auto"
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
                    listsPlugin(),
                    linkDialogPlugin(),
                    frontmatterPlugin(),
                ]}
                {...props}
                ref={editorRef}
            />
        </div>
    );
};

export default MyMDXEditor; 