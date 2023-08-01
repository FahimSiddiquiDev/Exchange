import { initExchangeController } from "./controller";

export const start = async () => {
    const exchange = initExchangeController();
    await exchange.loadOrders();
    exchange.printSnapshot();
};

(
    async () => await start()
)();