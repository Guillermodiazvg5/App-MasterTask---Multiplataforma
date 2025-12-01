import React from 'react';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonChip,
  IonNote
} from '@ionic/react';
import { FilterType } from '../hooks/useTaskFilters';
import { Category, CategoryDisplay, CategoryColors } from '../models/task.interface';

interface TaskFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  filterStats: {
    total: number;
    completed: number;
    pending: number;
    byCategory: Record<Category, number>;
  };
  searchQuery: string;  // ← NUEVA PROPIEDAD
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  onFilterChange,
  filterStats,
  searchQuery  // ← NUEVO PARÁMETRO
}) => {
  // Deshabilitar filtros cuando hay búsqueda activa
  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div style={{ marginBottom: '20px' }}>
      <IonSegment 
        value={activeFilter} 
        onIonChange={(e) => !isSearchActive && onFilterChange(e.detail.value as FilterType)}
        scrollable
        style={{ 
          padding: '4px',
          opacity: isSearchActive ? 0.6 : 1
        }}
        disabled={isSearchActive}
      >
        {/* Los mismos filtros que antes, pero deshabilitados durante búsqueda */}
        <IonSegmentButton value="all">
          <IonLabel style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Todas
            <IonChip color="primary" style={{ margin: 0, height: '20px', fontSize: '10px' }}>
              {filterStats.total}
            </IonChip>
          </IonLabel>
        </IonSegmentButton>

        <IonSegmentButton value="pending">
          <IonLabel style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Pendientes
            <IonChip color="warning" style={{ margin: 0, height: '20px', fontSize: '10px' }}>
              {filterStats.pending}
            </IonChip>
          </IonLabel>
        </IonSegmentButton>

        <IonSegmentButton value="completed">
          <IonLabel style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Completadas
            <IonChip color="success" style={{ margin: 0, height: '20px', fontSize: '10px' }}>
              {filterStats.completed}
            </IonChip>
          </IonLabel>
        </IonSegmentButton>

        {Object.values(Category).map(category => (
          <IonSegmentButton key={category} value={category}>
            <IonLabel style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {CategoryDisplay[category]}
              <IonChip 
                color={CategoryColors[category] as any} 
                style={{ margin: 0, height: '20px', fontSize: '10px' }}
              >
                {filterStats.byCategory[category]}
              </IonChip>
            </IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>

      {/* Indicador del filtro activo */}
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <IonNote style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
          {isSearchActive 
            ? 'Búsqueda activa - Filtros deshabilitados'
            : `Mostrando: ${getActiveFilterDisplayName(activeFilter)}`
          }
        </IonNote>
      </div>
    </div>
  );
};

// Función auxiliar (la misma que antes)
const getActiveFilterDisplayName = (filter: FilterType): string => {
  switch (filter) {
    case 'all': return 'Todas las tareas';
    case 'pending': return 'Tareas pendientes';
    case 'completed': return 'Tareas completadas';
    default: 
      return `Categoría: ${CategoryDisplay[filter as Category]}`;
  }
};

export default TaskFilters;