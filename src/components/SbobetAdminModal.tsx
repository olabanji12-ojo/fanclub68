import React from 'react';
import { useSbobetStore } from '../stores/sbobetStore';
import { SbobetAdminPortal } from './SbobetAdminPortal';

export const SbobetAdminModal: React.FC = () => {
  const { isAdminModalOpen, setIsAdminModalOpen } = useSbobetStore();

  if (!isAdminModalOpen) return null;

  return (
    <SbobetAdminPortal 
      isModal={true} 
      onClose={() => setIsAdminModalOpen(false)} 
    />
  );
};
