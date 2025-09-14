
export type SubstitutionRequest = {
  id: string;
  subject: string;
  class: string;
  time: string;
  date: string;
  status: 'Pending' | 'Accepted';
  notes?: string;
};

export const initialSubstitutions: SubstitutionRequest[] = [];
