import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    add: jest.fn(),
  };
};

describe("GenerateInvoiceUseCase unit test", () => {
    
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
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
    };

    const result = await generateInvoiceUseCase.execute(input);

    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.items).toEqual(input.items);
    expect(result.total).toEqual(123 + 456);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
  });
});
