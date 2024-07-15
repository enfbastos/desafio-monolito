import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import { InvoiceFacadeFactory } from "../factory/invoice.facade.factory";
import InvoiceModel from "../repository/invoice.model";


describe("InvoiceFacade test", () => {
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
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 123,
        },
        {
          id: "2",
          name: "Product 2",
          price: 456,
        },
      ],
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
    };

    const invoiceGenerated = await invoiceFacade.generate(input);
    
    const invoiceOnDB = await InvoiceModel.findOne({
      where: { id: invoiceGenerated.id },
    });

    expect(invoiceGenerated.id).toBeDefined();
    expect(invoiceOnDB.id).toBeDefined();
    expect(invoiceGenerated.name).toBe(input.name);
    expect(invoiceGenerated.document).toEqual(input.document);
    expect(invoiceGenerated.items).toEqual(input.items);
    expect(invoiceGenerated.total).toEqual(123 + 456);

    expect(invoiceGenerated.street).toEqual(input.street);
    expect(invoiceGenerated.number).toEqual(input.number);
    expect(invoiceGenerated.complement).toEqual(input.complement);
    expect(invoiceGenerated.city).toEqual(input.city);
    expect(invoiceGenerated.state).toEqual(input.state);
    expect(invoiceGenerated.zipCode).toEqual(input.zipCode);
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const invoiceCreated = await InvoiceModel.create({
      id: "999",
      name: "Invoice 2",
      document: "Document 2",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 123,
        },
        {
          id: "2",
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await invoiceFacade.find({ id: "999" });

    expect(result.id).toEqual(invoiceCreated.id);
    expect(result.name).toEqual(invoiceCreated.name);
    expect(result.document).toEqual(invoiceCreated.document);

    expect(result.createdAt.toString()).toEqual(
      invoiceCreated.createdAt.toString()
    );

    expect(result.total).toEqual(123 + 456);
    expect(result.items.length).toEqual(2);

    expect(result.address).toEqual(
        new Address(
            "Rua 123",
            "99",
            "Casa Verde",
            "Criciúma",
            "SC",
            "88888-888",
        )
    );
  });
});