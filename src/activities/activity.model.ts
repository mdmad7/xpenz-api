export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActTypeENUM;
  category: CategoryENUM;
  amount: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export enum ActTypeENUM {
  EXPENDITURE = 'EXPENDITURE',
  REVENUE = 'REVENUE',
}

export enum CategoryENUM {
  Automobile = 'Automobile',
  Salary = 'Salary',
  Savings = 'Savings',
  Investment = 'Investment',
  Shopping = 'Shopping',
  FoodDrinks = 'Food & Drinks',
  Education = 'Education',
  Entertainment = 'Entertainment',
  Furniture = 'Furniture',
  Gadget = 'Gadget',
  Gift = 'Gift',
  Groceries = 'Groceries',
  Fitness = 'Fitness',
  Loan = 'Loan',
  Medical = 'Medical',
  Misc = 'Misc',
  Housing = 'Housing',
  Clothing = 'Clothing',
  Tax = 'Tax',
  Transport = 'Transport',
  Travel = 'Travel',
  Utilities = 'Utilities',
}
