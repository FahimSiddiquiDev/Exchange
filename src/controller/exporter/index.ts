import { BinaryToTextEncoding, createHash } from "crypto";
import { formatPrice, formatQuantity } from "../../utilities";
import { OrderBook, TradePreview } from "../../interfaces";

export function createExporter(config: { algorithm: string, encodingType: BinaryToTextEncoding}) {
    function printTrades(trades: TradePreview[]) {
        trades.forEach((trade) => {
            console.log(`trade ${trade.aggressingOrderId},${trade.restingOrderId},${trade.price},${trade.quantity}`);
        });
    }

    function printOrderBook(bids: OrderBook[], asks: OrderBook[]) {
        let responseString = "";
        for (let i = 0; i< Math.max(bids.length, asks.length); i++) {
            if (i < bids.length) {
                const order = bids[i];
                responseString = responseString + `${formatQuantity(order.quantity)} ${formatPrice(order.price)} |`;
            } else {
                responseString += `${"".padStart(9, ' ')} ${"".padStart(6, ' ')} |`;
            }

            if (i < asks.length) {
                const order = asks[i];
                responseString = responseString + `${formatPrice(order.price)} ${formatQuantity(order.quantity)}`;
            }
            responseString += "\n"
        }
        console.log(responseString);
        const hashedOrderBook = createHash(config.algorithm).update(responseString).digest(config.encodingType);
        console.log(hashedOrderBook)
    }
    return {
        printTrades,
        printOrderBook
    }
}
