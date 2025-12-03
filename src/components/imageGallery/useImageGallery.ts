import { useCallback, useState } from 'react';

export const useImageGallery = (total: number) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleKeyPress = (key: string) => {
    if (key === 'Escape') closeModal();
    if (key === 'ArrowLeft') {
      setSelectedIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    }
    if (key === 'ArrowRight') {
      setSelectedIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    }
  };

  const onSelect = useCallback((index: number) => setSelectedIndex(index), []);

  return {
    selectedIndex,
    setSelectedIndex: onSelect,
    isOpen,
    openModal,
    closeModal,
    handleKeyPress,
  };
};
