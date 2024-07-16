import request from "supertest";
import { app, sequelize } from "../express";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app).post("/client").send({
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      address: {
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      }
    });

    expect(response.status).toEqual(201);
  });

  it("should not create a client", async () => {
    const response = await request(app).post("/client").send({
      id: "1",
      email: "x@x.com",
      document: "12345",
      address: {
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      }
    });

    expect(response.status).toEqual(400);
  });
});
