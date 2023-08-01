import { Order, Side, Trade } from "../../interfaces";
import { Exchange } from "../interfaces";

export function createExchange(): Exchange {
    const bids: Order[] = [];
    const asks: Order[] = [];
    const trades: Trade[] = [];

    function processBuyOrder(buyOrder: Order) {
        while (buyOrder.quantity > 0 && asks.length > 0 && asks[0].price <= buyOrder.price) {
            const sellOrder = asks[0];
            const matchedQuantity = Math.min(buyOrder.quantity, sellOrder.quantity);
            trades.push({
                aggressingOrderId: buyOrder.orderId,
                restingOrderId: sellOrder.orderId,
                price: sellOrder.price,
                quantity: matchedQuantity,
                createdAt: Date.now()
            });

            buyOrder.quantity -= matchedQuantity;
            sellOrder.quantity -= matchedQuantity;

            if (sellOrder.quantity === 0) {
                asks.shift();
            }
        }

        if (buyOrder.quantity > 0) {
            bids.push(buyOrder);
        }
        rearrangeBids();
    }
    function rearrangeBids() {
        bids.sort((x,y) => y.price - x.price  || x.createdAt - y.createdAt)
    }
    function rearrangeAsks() {
        asks.sort((x,y) => x.price - y.price || x.createdAt - y.createdAt)
    }
    function processSellOrder(sellOrder: Order) {
        while (sellOrder.quantity > 0 && bids.length > 0 && bids[0].price >= sellOrder.price) {
            const buyOrder = bids[0];
            const matchedQuantity = Math.min(buyOrder.quantity, sellOrder.quantity);
            trades.push({
                aggressingOrderId: sellOrder.orderId,
                restingOrderId: buyOrder.orderId,
                price: buyOrder.price,
                quantity: matchedQuantity,
                createdAt: Date.now()
            });

            sellOrder.quantity -= matchedQuantity;
            buyOrder.quantity -= matchedQuantity;

            if (buyOrder.quantity === 0) {
                bids.shift();
            }
        }

        if (sellOrder.quantity > 0) {
            asks.push(sellOrder);
        }
        rearrangeAsks();
    }
    function processOrder(order: Order): void {
      if (order.side === Side.Buyer) {
        processBuyOrder(order);
      } else if (order.side === Side.Seller) {
        processSellOrder(order);
      }
    }
    function getTrades() {
        return trades.map(trade => ({
            aggressingOrderId: trade.aggressingOrderId,
            restingOrderId: trade.restingOrderId,
            price: trade.price, 
            quantity: trade.quantity
        }));
    }
    function getOrderBookSnapShot() {
        return {
            bids: bids.map( bid => ({ price: bid.price, quantity: bid.quantity })),
            asks: asks.map( ask => ({ price: ask.price, quantity: ask.quantity }))
        }
    }
    return {
        processOrder,
        getTrades,
        getOrderBookSnapShot
    }
}