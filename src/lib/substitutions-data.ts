
export type SubstitutionRequest = {
  id: string;
  timestamp: number;
  notes: string;
  status: 'Pending' | 'Accepted';
  requesterId: string;
  requesterName: string;
  acceptedBy?: string; // User's full name of the teacher who accepted
};

export const initialSubstitutions: SubstitutionRequest[] = [];
