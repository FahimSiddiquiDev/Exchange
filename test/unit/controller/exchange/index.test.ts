import { createExchange } from "../../../../src/controller/exchange";
import { Side } from "../../../../src/interfaces";

describe("controller/exchange", () => {
    const buyOrder = {
        createdAt: Date.now(),
        orderId: "test-order-id-1",
        price: 100,
        quantity: 10000,
        side: Side.Buyer
    };
    const sellOrder = {
        createdAt: Date.now(),
        orderId: "test-order-id-2",
        price: 101,
        quantity: 500,
        side: Side.Seller
    };
    it("should successfully process buy order and store it inside bids array", () => {
        const exchange = createExchange();
        exchange.processOrder(buyOrder);
        const { bids, asks } = exchange.getOrderBookSnapShot()
        expect(bids).toEqual([{"price": 100, "quantity": 10000}]);
        expect(asks).toEqual([]);
        expect(exchange.getTrades()).toEqual([]);
    });
    it("should successfully process sell order and store it into asks array", () => {
        const exchange = createExchange();
        exchange.processOrder(sellOrder);
        const { asks, bids } = exchange.getOrderBookSnapShot()
        expect(asks).toEqual([{"price": 101, "quantity": 500}]);
        expect(bids).toEqual([]);
        expect(exchange.getTrades()).toEqual([]);
    });
    it("should not book trade if buyorder price is less than sell order price ", () => {
        const exchange = createExchange();
        exchange.processOrder({ ...sellOrder, price: 109});
        exchange.processOrder(buyOrder);
        const { asks, bids } = exchange.getOrderBookSnapShot();
        expect(asks).toEqual([{"price": 109, "quantity": 500}]);
        expect(bids).toEqual([{"price": 100, "quantity": 10000}]);
        expect(exchange.getTrades()).toEqual([]);
    });
    it("should aggressively match the price and book trade if buyorder price is more than sell order price ", () => {
        const exchange = createExchange();
        exchange.processOrder(buyOrder);
        exchange.processOrder({ ...sellOrder, price: 90});
        const { asks, bids } = exchange.getOrderBookSnapShot()
        expect(asks).toEqual([]);
        expect(bids).toEqual([{"price": 100, "quantity": 9500}]);
        expect(exchange.getTrades()).toEqual([
            {
                aggressingOrderId: "test-order-id-2",
                price: 100,
                quantity: 500,
                restingOrderId: "test-order-id-1",
            },
        ]);

        exchange.processOrder({ ...sellOrder, price: 95, quantity: 9500});

        const { asks: asksAfterSecondIteration, bids: bidsAfterSecondIteration } = exchange.getOrderBookSnapShot()
        expect(asksAfterSecondIteration).toEqual([]);
        expect(bidsAfterSecondIteration).toEqual([]);
        expect(exchange.getTrades()).toEqual([
            {
                aggressingOrderId: "test-order-id-2",
                price: 100,
                quantity: 500,
                restingOrderId: "test-order-id-1",
            },
            {
                aggressingOrderId: "test-order-id-2",
                price: 100,
                quantity: 9500,
                restingOrderId: "test-order-id-1",
            }
        ]);
    });
    it("should aggressively match the price if book orders are resting and sell order with less price hits the exchange", () => {
        const exchange = createExchange();
        exchange.processOrder({ ...sellOrder, price: 90, orderId: "id-1"});
        exchange.processOrder({ ...sellOrder, price: 95, orderId: "id-2"});
        exchange.processOrder({ ...sellOrder, price: 100, orderId: "id-3", quantity: 1000});
        exchange.processOrder({ ...buyOrder, price: 92, orderId: "id-4", quantity: 500});
        const { asks, bids } = exchange.getOrderBookSnapShot();
        expect(asks).toEqual([
            {"price": 95, "quantity": 500},
            {"price": 100, "quantity": 1000}
        ]);
        expect(bids).toEqual([]);
        expect(exchange.getTrades()).toEqual([
            {
                "aggressingOrderId": "id-4",
                "price": 90,
                "quantity": 500,
                "restingOrderId": "id-1",
              }
        ]);
        exchange.processOrder({ ...sellOrder, price: 102, orderId: "id-5", quantity: 50});
        const { asks: asksAfterSecondIteration } = exchange.getOrderBookSnapShot();
        expect(asksAfterSecondIteration).toEqual([
            {"price": 95, "quantity": 500},
            {"price": 100, "quantity": 1000},
            {"price": 102, "quantity": 50}
        ]);
        exchange.processOrder({ ...buyOrder, price: 105, orderId: "id-6", quantity: 1550});
        const { asks: asksAfterThirdIteration, bids: bidsAfterThirdIteration } = exchange.getOrderBookSnapShot();
        expect(asksAfterThirdIteration).toEqual([]);
        expect(bidsAfterThirdIteration).toEqual([]);
        expect(exchange.getTrades()).toEqual([
            {
                "aggressingOrderId": "id-4",
                "price": 90,
                "quantity": 500,
                "restingOrderId": "id-1",
            },
            {
                "aggressingOrderId": "id-6",
                "price": 95,
                "quantity": 500,
                "restingOrderId": "id-2",
            },
            {
                "aggressingOrderId": "id-6",
                "price": 100,
                "quantity": 1000,
                "restingOrderId": "id-3",
            },
            {
                "aggressingOrderId": "id-6",
                "price": 102,
                "quantity": 50,
                "restingOrderId": "id-5",
            }
        ]);
    });
    

})