import { OrderBook, TradePreview } from "../../interfaces";

export interface Exporter {
    printTrades(trades: TradePreview[]): void,
    printOrderBook(bids: OrderBook[], asks: OrderBook[]): void
}
