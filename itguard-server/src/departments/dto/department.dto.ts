export interface CreateDepartmentDTO {
  name: string;
  description?: string;
  active?: boolean;
}

export interface UpdateDepartmentDTO {
  name?: string;
  description?: string;
  active?: boolean;
}
