import request from "supertest";
import { app, sequelize } from "../express";

import Address from "../../modules/@shared/domain/value-object/address";
import Id from "../../modules/@shared/domain/value-object/id.value-object";
import Invoice from "../../modules/invoice/domain/invoice";
import InvoiceItem from "../../modules/invoice/domain/invoice-item";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";

describe("E2E test for invoice", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    const address = new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
    );

    const item1 = new InvoiceItem({
      id: new Id("1"),
      name: "Item 1",
      price: 123,
    });

    const item2 = new InvoiceItem({
      id: new Id("2"),
      name: "Item 2",
      price: 456,
    });

    const invoice = new Invoice({
      id: new Id("999"),
      name: "Invoice 1",
      document: "Document 1",
      items: [item1, item2],
      address: address,
    });

    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.add(invoice);

    const response = await request(app).get(`/invoice/${999}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual("Invoice 1");
  });
});