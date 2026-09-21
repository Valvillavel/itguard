export interface CreateLicenseAssignmentDTO {
  licenseId: number;
  assetId?: number;
  userId?: string;
  assignedById?: string;
  observations?: string;
}

export interface UnassignLicenseDTO {
  status?: string;
  observations?: string;
}
