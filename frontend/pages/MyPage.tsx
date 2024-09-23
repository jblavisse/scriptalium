// pages/MyPage.tsx
import React, { useRef } from 'react';
import MyMDXEditor from '../components/MDXEditor'; // Assurez-vous que le chemin est correct
import { MDXEditorMethods } from '@mdxeditor/editor';

const MyPage: React.FC = () => {
    const editorRef = useRef<MDXEditorMethods>(null);

    const handleEditorChange = (markdown: string) => {
        console.log('Markdown mis à jour:', markdown);
    };

    const handleEditorBlur = (e: React.FocusEvent) => {
        console.log('Éditeur perdu le focus');
    };

    return (
        <div>
            <h1>My Page with MDXEditor</h1>
            <MyMDXEditor
                editorRef={editorRef}
                markdown={`# Bonjour

Ceci est un éditeur **MDX**. Sélectionnez du texte pour le surligner automatiquement.`}
                onChange={handleEditorChange}
                placeholder="Commencez à écrire en MDX..."
            />
        </div>
    );
};

export default MyPage;
