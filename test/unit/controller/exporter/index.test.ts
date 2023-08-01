import { createExporter } from "../../../../src/controller/exporter";
jest.spyOn(global.console, 'log');

describe("controller/exporter", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should successfully spy printOrderBook - on 2 console.logs which prints orderbook", () => {
        const exporter = createExporter({algorithm: "md5",encodingType: "hex" });
        exporter.printOrderBook(
            [{
                price: 10, quantity: 100
            }],
            [{
                price: 200, quantity: 100,
            },
            {
                price: 400, quantity: 101,
            }]
        );
        expect(console.log).toBeCalledTimes(2);
    });
    it("should successfully spy printTrades - on 1 console.logs which prints trades", () => {
        const exporter = createExporter({algorithm: "md5",encodingType: "hex" });
        exporter.printTrades([{
            aggressingOrderId: "agg-id",
            price: 10,
            quantity: 10,
            restingOrderId: "rest-id"
        }]);
        expect(console.log).toBeCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith("trade agg-id,rest-id,10,10");
    });
})