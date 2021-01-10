export interface Customer {
  id?: number;
  name?: string;
  phone?: string;
  address?: string;
  membership?: string;
}

export enum PrintMedia {
  Newspaper = 1,
  Newsletter = 5,
  Magazine = 6,
  Book = 10
}

export interface User {
  id?: number;
  name?: string;
  role?: string;
  department?: string;
}

export enum Permission {
  UserRead,
  UserWrite,
  UserExecute,
  GroupRead,
  GroupWrite,
  GroupExecute,
  AllRead,
  AllWrite,
  AllExecute,
}

