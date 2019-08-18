const appMock = require("./app");
require("./index");

jest.mock("./app");

describe("index.js - app entry", () => {
    it("should call app.listen()", () => {
        expect(appMock.listen).toHaveBeenCalled();
    });
});