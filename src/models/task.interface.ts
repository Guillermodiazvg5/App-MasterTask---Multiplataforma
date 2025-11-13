export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  createdAt: Date;
  updatedAt?: Date;
}

export enum Category {
  STUDY = 'study',
  PERSONAL = 'personal', 
  WORK = 'work',
  URGENT = 'urgent'
}

export const CategoryDisplay = {
  [Category.STUDY]: 'Estudio',
  [Category.PERSONAL]: 'Personal',
  [Category.WORK]: 'Trabajo',
  [Category.URGENT]: 'Urgente'
};

export const CategoryColors = {
  [Category.STUDY]: 'primary',
  [Category.PERSONAL]: 'success',
  [Category.WORK]: 'warning',
  [Category.URGENT]: 'danger'
};