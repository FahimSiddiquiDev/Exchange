import { createInterface } from "readline";
import { Order } from "../../interfaces";
import { validateOrderInput } from "./input-validator/order";
export * from "./input-validator/order";

export function createDataLoader() {
    const rl = createInterface({
        input: process.stdin,
        terminal: false
    });
    
    async function startOrderStream(operation: (order: Order) => void) {
        for await (const line of rl) {
            try {
                const order = parseOrder(line);
                operation(order);
            } catch(exception: unknown) {
                console.error("Unable to process current order, ignoring it", { exception });
            }
        }
    }
    function parseOrder(line: string) {
        const [orderId, side, price, quantity] = line.split(',');
        return validateOrderInput({
            orderId,
            side,
            price,
            quantity,
            createdAt: Date.now()
        });
    }
    
    return {
        startOrderStream
    }
}
