export interface Trade {
    aggressingOrderId: string;
    restingOrderId: string;
    price: number;
    quantity: number;
    createdAt: number;
  }

export type TradePreview = Omit<Trade, "createdAt">