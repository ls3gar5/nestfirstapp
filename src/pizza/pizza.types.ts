export type Pizza = {
  name: string;
  price: number;
};

export type Order = {
  id: number;
  pizza: Pizza;
  status: string;
};

export enum OrderStatus {
  ORDERED = 'ordered',
  COMPLETED = 'completed',
}
