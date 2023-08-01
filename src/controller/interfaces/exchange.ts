import { Order } from "../../interfaces";

export interface Exchange {
    processOrder(order: Order): void,
    getTrades(): {
        aggressingOrderId: string;
        restingOrderId: string;
        price: number;
        quantity: number;
    }[];
    getOrderBookSnapShot(): {
        bids: {
            price: number;
            quantity: number;
        }[];
        asks: {
            price: number;
            quantity: number;
        }[];
    }
}
