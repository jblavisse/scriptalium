// components/MDXEditor.tsx
import React, {
    useState,
    useRef,
    useEffect,
    ForwardedRef,
    useImperativeHandle,
} from 'react';
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

const MyMDXEditor: React.FC<MyMDXEditorProps> = React.forwardRef(({ editorRef, ...props }, ref) => {
    const [toolkitPosition, setToolkitPosition] = useState<{ x: number; y: number } | null>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const internalEditorRef = useRef<MDXEditorMethods>(null);

    // Expose internalEditorRef to parent via ref
    useImperativeHandle(ref, () => internalEditorRef.current as MDXEditorMethods);

    // Fonction pour injecter le surlignage dans le Markdown
    const highlightSelectionInMarkdown = () => {
        if (!internalEditorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (!editorContainerRef.current?.contains(range.commonAncestorContainer)) return;

        if (range.collapsed) return;

        // Récupérer le texte sélectionné
        const selectedText = selection.toString();

        // Récupérer le contenu actuel en Markdown
        const currentMarkdown = internalEditorRef.current.getMarkdown();

        // Utiliser un regex pour vérifier si le texte est déjà surligné
        const highlightRegex = new RegExp(`<span class="highlight">${escapeRegExp(selectedText)}</span>`, 'g');

        if (highlightRegex.test(currentMarkdown)) {
            // Si déjà surligné, ne pas surligner à nouveau
            console.log('Le texte est déjà surligné');
            return;
        }

        // Trouver la position de la sélection dans le Markdown
        const index = currentMarkdown.indexOf(selectedText);
        if (index === -1) return;

        // Vérifier si le texte sélectionné est déjà partiellement surligné
        const beforeSelection = currentMarkdown.substring(0, index);
        const afterSelection = currentMarkdown.substring(index + selectedText.length);

        // Assurer que l'injection ne casse pas la structure Markdown
        // Ici, nous assumons que le texte sélectionné n'est pas déjà partiellement surligné

        // Injecter les balises <span> autour du texte sélectionné
        const highlighted = `<span class="highlight">${selectedText}</span>`;
        const newMarkdown = beforeSelection + highlighted + afterSelection;

        // Mettre à jour le Markdown de l'éditeur
        internalEditorRef.current.setMarkdown(newMarkdown);

        // Optionnel : Réinitialiser la sélection
        window.getSelection()?.removeAllRanges();
    };

    // Échapper les caractères spéciaux pour les utiliser dans les regex
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

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

                // Envoyer le texte sélectionné à la base de données
                fetch("http://127.0.0.1:8000/api/save-selection/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ selectedText }),
                });

                // Surligner le texte sélectionné dans le Markdown
                highlightSelectionInMarkdown();
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
    }, []);

    return (
        <div className="mdx-editor-container" ref={editorContainerRef} style={{ position: 'relative' }}>
            <MDXEditor
                contentEditableClassName="MDXEditor-content"
                className={props.className}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
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
                                {/* Bouton de Surlignage */}
                                <div className="toolbar-item">
                                    <button
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Empêcher la perte de focus de l'éditeur
                                            highlightSelectionInMarkdown();
                                        }}
                                        title="Surligner"
                                        style={{
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                            background: 'none',
                                            border: 'none',
                                        }}
                                    >
                                        🖍️
                                    </button>
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
                ref={internalEditorRef}
            />

            {/* Afficher la toolkit uniquement lorsque du texte est sélectionné dans l'éditeur */}
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
                    {/* Actions de la toolkit */}
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault();
                            highlightSelectionInMarkdown();
                        }}
                        style={{
                            padding: '5px 10px',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                        }}
                        title="Surligner"
                    >
                        🖍️ Surligner
                    </button>
                    <button onClick={() => console.log('Italic')}>Italic</button>
                    <button onClick={() => console.log('Link')}>Link</button>
                    {/* Ajoutez plus d'actions si nécessaire */}
                </div>
            )}
        </div>
    );

});

export default MyMDXEditor;
