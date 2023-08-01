import * as readline from "readline";
import { createDataLoader } from "../../../../src/controller/loader";

describe("controller/loader", () => {
    describe('startOrderStream', () => { 
        it("should successfully load order from the mocked stream", async () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return ['10000,B,98,25500'] as unknown as readline.Interface
              });
            const loader = createDataLoader();
            await loader.startOrderStream((order) => { 
                expect(order.orderId).toEqual("10000");
            });
        });
    })    
});
