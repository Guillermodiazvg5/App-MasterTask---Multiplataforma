import { useState, useMemo } from 'react';
import { Task, Category, CategoryDisplay } from '../models/task.interface';

export type FilterType = 'all' | 'pending' | 'completed' | Category;

export const useTaskFilters = (tasks: Task[]) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar tareas según el filtro activo Y búsqueda
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Aplicar filtro principal
    switch (activeFilter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'all':
        // No filtrar por estado
        break;
      default:
        // Filtro por categoría
        filtered = filtered.filter(task => task.category === activeFilter);
    }

    // Aplicar búsqueda si hay query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, activeFilter, searchQuery]);

  // Calcular estadísticas por filtro (sin búsqueda)
  const filterStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    const byCategory = Object.values(Category).reduce((acc, category) => {
      acc[category] = tasks.filter(task => task.category === category).length;
      return acc;
    }, {} as Record<Category, number>);

    return { total, completed, pending, byCategory };
  }, [tasks]);

  // Obtener nombre display del filtro activo
  const getActiveFilterName = (): string => {
    if (searchQuery) {
      return `Búsqueda: "${searchQuery}"`;
    }

    switch (activeFilter) {
      case 'all': return 'Todas las tareas';
      case 'pending': return 'Tareas pendientes';
      case 'completed': return 'Tareas completadas';
      default: 
        return `${CategoryDisplay[activeFilter as Category]}`;
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    filterStats,
    getActiveFilterName,
    clearSearch
  };
};