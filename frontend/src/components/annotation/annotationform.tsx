import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"




function AnnotationForm() {
  return (
    <div className="sm:max-w-[425px]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Importer une annotation existante :</h2>
      </div>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input id="search" placeholder="Search" />
        </div>
        <p className="text-center">Ou</p>
        <div className="space-y-2">
          <Label htmlFor="type">Crée une annotation :</Label>
          <Select>
            <SelectTrigger id="type" aria-label="Select Type">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type1">Type 1</SelectItem>
              <SelectItem value="type2">Type 2</SelectItem>
              <SelectItem value="type3">Type 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" placeholder="Titre" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Lorem ipsum" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button>Valider</Button>
      </div>
    </div>
  );
}

export default AnnotationForm;
