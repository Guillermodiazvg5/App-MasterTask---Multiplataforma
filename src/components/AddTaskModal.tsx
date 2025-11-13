import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonLabel,
  IonButtons,
  IonIcon
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { Category, CategoryDisplay } from '../models/task.interface';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, category: Category) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(Category.STUDY);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), category);
      setTitle('');
      setCategory(Category.STUDY);
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setCategory(Category.STUDY);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCancel}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agregar Nueva Tarea</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCancel}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: '16px' }}>
          <IonItem>
            <IonLabel position="stacked">Título de la tarea *</IonLabel>
            <IonInput
              value={title}
              placeholder="¿Qué necesitas hacer?"
              onIonInput={(e) => setTitle(e.detail.value!)}
              autofocus
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Categoría</IonLabel>
            <IonSelect 
              value={category} 
              onIonChange={(e) => setCategory(e.detail.value)}
            >
              {Object.values(Category).map(cat => (
                <IonSelectOption key={cat} value={cat}>
                  {CategoryDisplay[cat]}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
            <IonButton expand="block" color="medium" onClick={handleCancel}>
              Cancelar
            </IonButton>
            <IonButton expand="block" onClick={handleSave} disabled={!title.trim()}>
              Guardar
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default AddTaskModal;