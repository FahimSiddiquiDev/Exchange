import { validateOrderInput } from "../../../../../src/controller/loader";


describe("controller/loader/input-validator", () => {
    it("should throw error for undefined input ", () => {
        expect(() => validateOrderInput(undefined)).toThrow();
    });
    it("should throw error for empty string input ", () => {
        expect(() => validateOrderInput("")).toThrow();
    });
    it("should throw error for invalid order object string input ", () => {
        expect(() => validateOrderInput("1000,K,98,100")).toThrow();
    });
    it("should throw error for invalid order side ", () => {
        expect(() => validateOrderInput({
            orderId: "1000",
            side: "K",
            price: 100,
            quantity: 100,
            createdAt: Date.now()
        })).toThrowError("Validation errors:\n {\"received\":\"K\",\"code\":\"invalid_enum_value\",\"options\":[\"B\",\"S\"],\"path\":[\"side\"],\"message\":\"Invalid enum value. Expected 'B' | 'S', received 'K'\"}");
    });
    it("should throw error for invalid order price, less than 1 ", () => {
        expect(() => validateOrderInput({
            orderId: "1000",
            side: "S",
            price: 0,
            quantity: 100,
            createdAt: Date.now()
        })).toThrowError("Validation errors:\n {\"code\":\"too_small\",\"minimum\":1,\"type\":\"number\",\"inclusive\":true,\"exact\":false,\"message\":\"Number must be greater than or equal to 1\",\"path\":[\"price\"]}");
    });    
    it("should throw error for invalid order price, greater than 1000000 ", () => {
        expect(() => validateOrderInput({
            orderId: "1000",
            side: "S",
            price: 1000000,
            quantity: 100,
            createdAt: Date.now()
        })).toThrowError("Validation errors:\n {\"code\":\"too_big\",\"maximum\":999999,\"type\":\"number\",\"inclusive\":true,\"exact\":false,\"message\":\"Number must be less than or equal to 999999\",\"path\":[\"price\"]}");
    }); 
    it("should throw error for invalid order quantity, less than 1 ", () => {
        expect(() => validateOrderInput({
            orderId: "1000",
            side: "S",
            price: 999999,
            quantity: 0,
            createdAt: Date.now()
        })).toThrowError("Validation errors:\n {\"code\":\"too_small\",\"minimum\":1,\"type\":\"number\",\"inclusive\":true,\"exact\":false,\"message\":\"Number must be greater than or equal to 1\",\"path\":[\"quantity\"]}");
    });    
    it("should throw error for invalid order quantity, greater than 1000000000 ", () => {
        expect(() => validateOrderInput({
            orderId: "1000",
            side: "S",
            price: 999999,
            quantity: 1000000000,
            createdAt: Date.now()
        })).toThrowError("Validation errors:\n {\"code\":\"too_big\",\"maximum\":999999999,\"type\":\"number\",\"inclusive\":true,\"exact\":false,\"message\":\"Number must be less than or equal to 999999999\",\"path\":[\"quantity\"]}");
    });    
    it("should successfully validate and return order object", () => {
        const order = {
            orderId: "1000",
            side: "S",
            price: 100,
            quantity: 100,
            createdAt: Date.now()
        };
        expect(validateOrderInput(order)).toEqual(order);
    });
})
