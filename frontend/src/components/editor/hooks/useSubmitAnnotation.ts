import axiosInstance from './axiosInstance';

interface AnnotationData {
  title: string;
  description: string;
}

export const useSubmitAnnotation = () => {
  const submitAnnotation = async (
    formData: AnnotationData,
    selectedText: string,
    startIndex: number,
    endIndex: number
  ) => {
    const data = {
      ...formData,
      selectedText,
      start_index: startIndex,
      end_index: endIndex,
    };

    const response = await axiosInstance.post('api/texts/add-annotation/', data);
    return response.data;
  };

  return { submitAnnotation };
};
