import type { ReactNode } from "react"

export interface LinkInterface {
    label: string
    to: string
}

export interface StepInterface {
  number: number
  title: string
  description: string
}

export interface Option {
  key: number
  label: string | any
  value: string
  icon?: ReactNode
}

export interface BaseModelInterface {
  id: string
  unique_id?: string
  position?: number
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface BaseGetParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
};

export type GetByIdParams = {
  id: string;
};

export type UpdateParams<T> = {
  id: string;
  payload: T
};
