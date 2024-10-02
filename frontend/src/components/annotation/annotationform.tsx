import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSubmitAnnotation } from '../editor/hooks/useSubmitAnnotation';

interface SelectionInfo {
  text: string;
  rect: DOMRect;
  startIndex: number;
  endIndex: number;
}

interface AnnotationFormProps {
  selectedText: string | null;
  startIndex: number;
  endIndex: number;
  onSelectionChange: (selection: SelectionInfo | null) => void;
}

const AnnotationForm: React.FC<AnnotationFormProps> = ({
  selectedText,
  startIndex,
  endIndex,
  onSelectionChange,
}) => {
  const { submitAnnotation } = useSubmitAnnotation();

  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedText) {
      try {
        await submitAnnotation(formData, selectedText, startIndex, endIndex);
        alert('Annotation ajoutée avec succès');
        onSelectionChange(null);
      } catch (error) {
        alert('Erreur lors de l\'ajout de l\'annotation');
      }
    } else {
      alert('Aucun texte sélectionné');
    }
  };

  return (
    <div className="sm:max-w-[425px]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Ajouter une annotation :</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              placeholder="Titre"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description de l'annotation"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => onSelectionChange(null)}>
            Annuler
          </Button>
          <Button type="submit">Valider</Button>
        </div>
      </form>
    </div>
  );
};

export default AnnotationForm;
