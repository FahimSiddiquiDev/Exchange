import { initExchangeController } from "../../../src/controller";
import * as readline from "readline";

jest.spyOn(global.console, 'log');

describe('controller', () => { 
    jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
        return ['10000,B,98,25500'] as unknown as readline.Interface
      });
    it("should successfully initialize the exchange controller and print snapshots", async () => {
        const exchange = initExchangeController();
        await exchange.loadOrders();
        exchange.printSnapshot();
        expect(console.log).toBeCalledTimes(2);
        expect(console.log).toHaveBeenCalledWith("5bf07a35dc85d7504ee1f44f8e8a732d");
    })
 });
 