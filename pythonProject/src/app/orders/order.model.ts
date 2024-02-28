export interface Order {
  id?: number;
  product_id: number;
  quantity: number;
  status: string;
  owner: string | null;
}