
export type SubstitutionRequest = {
  id: string;
  subject: string;
  class: string;
  time: string;
  date: string;
  status: 'Pending' | 'Accepted';
  notes?: string;
};

export const initialSubstitutions: SubstitutionRequest[] = [
  {
    id: 'sub1',
    subject: 'Mathematics',
    class: '10A',
    time: '10:00 - 11:00 AM',
    date: '2024-07-26',
    status: 'Accepted',
    notes: 'Covering Chapter 5, Algebra. Materials are on the desk.'
  },
  {
    id: 'sub2',
    subject: 'Physics',
    class: '12B',
    time: '02:00 - 03:00 PM',
    date: '2024-07-27',
    status: 'Pending',
    notes: 'Lab session on optics. Please supervise students.'
  },
    {
    id: 'sub3',
    subject: 'History',
    class: '9C',
    time: '11:00 - 12:00 PM',
    date: '2024-07-28',
    status: 'Pending',
  },
];
