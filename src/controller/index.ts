import { createDataLoader } from "./loader";
import { createExchange } from "./exchange";
import { createExporter } from "./exporter";
import { Exchange, Exporter, Loader } from "./interfaces";

export function initExchangeController() {
    const exchange: Exchange = createExchange();
    const exporter: Exporter = createExporter({ algorithm: "md5", encodingType: "hex"});
    const loader: Loader = createDataLoader();

    /**
     * Loads tickers from the given stream and process each order
     */
    async function loadOrders() {
        await loader.startOrderStream(exchange.processOrder)
    }

    /**
     * Snapshots past trades and current orderbook
     */
    function printSnapshot() {
        const trades = exchange.getTrades();
        const { bids, asks } = exchange.getOrderBookSnapShot();

        exporter.printTrades(trades);
        exporter.printOrderBook(bids, asks);
    }
    return {
        loadOrders,
        printSnapshot  
    }
}

