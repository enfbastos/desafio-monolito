import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
    });

    expect(response.status).toEqual(201);
  });
});
