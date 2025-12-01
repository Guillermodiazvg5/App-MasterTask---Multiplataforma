import React from 'react';
import {
  IonSearchbar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/react';
import { close, search } from 'ionicons/icons';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  resultsCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  resultsCount
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Barra de búsqueda */}
      <IonSearchbar
        value={searchQuery}
        onIonInput={(e) => onSearchChange(e.detail.value!)}
        placeholder="Buscar tareas..."
        animated
        style={{ 
          '--background': 'var(--ion-color-light)',
          '--box-shadow': '0 2px 6px rgba(0,0,0,0.1)'
        }}
      />

      {/* Información de resultados */}
      {searchQuery && (
        <IonItem 
          lines="none" 
          style={{ 
            '--background': 'transparent',
            marginTop: '8px'
          }}
        >
          <IonIcon icon={search} slot="start" color="medium" />
          <IonLabel>
            <small>
              {resultsCount === 0 
                ? `No se encontraron tareas para "${searchQuery}"`
                : `${resultsCount} tarea${resultsCount !== 1 ? 's' : ''} encontrada${resultsCount !== 1 ? 's' : ''}`
              }
            </small>
          </IonLabel>
          <IonButton 
            fill="clear" 
            size="small" 
            onClick={onClearSearch}
            color="medium"
          >
            <IonIcon icon={close} />
            Limpiar
          </IonButton>
        </IonItem>
      )}
    </div>
  );
};

export default SearchBar;