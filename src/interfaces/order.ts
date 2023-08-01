
export const enum Side {
  "Buyer" = "B",
  "Seller" = "S"
}
export interface Order {
    orderId: string;
    side: Side;
    price: number;
    quantity: number;
    createdAt: number;
  }


export type OrderBook = Omit<Order, "createdAt"|"orderId"|"side">
