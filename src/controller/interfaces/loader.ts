


import { Order } from "../../interfaces";

export interface Loader {
    startOrderStream(operation: (order: Order) => void): Promise<void>
}
