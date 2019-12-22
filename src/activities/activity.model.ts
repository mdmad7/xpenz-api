export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActTypeENUM;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export enum ActTypeENUM {
  EXPENDITURE = 'EXPENDITURE',
  REVENUE = 'REVENUE',
  SAVING = 'SAVING',
  INVESTMENT = 'INVESTMENT',
}
