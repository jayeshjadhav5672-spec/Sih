
export type SubstitutionRequest = {
  id: string;
  subject: string;
  class: string;
  time: string;
  date: string;
  status: 'Pending' | 'Accepted';
  notes?: string;
  acceptedBy?: string; // Add user ID of the teacher who accepted
  requesterName?: string; // Add name of the teacher who made the request
};

export const initialSubstitutions: SubstitutionRequest[] = [];
