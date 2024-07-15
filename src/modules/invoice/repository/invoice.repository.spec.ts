import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";


describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
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

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "999" } })

    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.items).toHaveLength(2);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.street).toEqual(invoice.address.street);
  });

  it("should find an invoice", async () => {
    const invoiceCreated = await InvoiceModel.create({
      id: "888",
      name: "Invoice 2",
      document: "Document 2",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: new Id("1"),
          name: "Item 1",
          price: 123,
        },
        {
          id: new Id("2"),
          name: "Item 2",
          price: 456,
        },
      ],
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",
    });

    const invoiceRepository = new InvoiceRepository();

    const result = await invoiceRepository.find("888");

    expect(result.id.id).toEqual(invoiceCreated.id);
    expect(result.name).toEqual(invoiceCreated.name);
    expect(result.document).toEqual(invoiceCreated.document);
    expect(result.items[0].name).toEqual(invoiceCreated.items[0].name);
    expect(result.items[1].name).toEqual(invoiceCreated.items[1].name);
    expect(result.items[1].price).toEqual(invoiceCreated.items[1].price);
    expect(result.items[1].id.id).toEqual(invoiceCreated.items[1].id);
    expect(result.total).toEqual(invoiceCreated.items[0].price + invoiceCreated.items[1].price);
    expect(result.address).toEqual(
      new Address(
        invoiceCreated.street,
        invoiceCreated.number,
        invoiceCreated.complement,
        invoiceCreated.city,
        invoiceCreated.state,
        invoiceCreated.zipcode,
      )
    );
  });
});