import request from "supertest";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { app, sequelize } from "../express";


describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // if (!migration || !sequelize) {
    //   return 
    // }
    // await migration.down()
    await sequelize.close();
  });

  it("should place an order", async () => {
    await ClientModel.create({
        id: "1c",
        name: "Client 1",
        document: "0000",
        email: "client@email.com",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipcode: "88888-888",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Description 1",
        purchasePrice: 140,
        salesPrice: 140,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await ProductModel.create({
        id: "2",
        name: "Product 2",
        description: "Description 2",
        purchasePrice: 30,
        salesPrice: 30,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const response = await request(app).post("/checkout").send({
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
    });

    expect(response.status).toEqual(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.total).toEqual(170);
    expect(response.body.status).toEqual("approved");
  });
});
