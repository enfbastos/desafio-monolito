

import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import FindInvoiceUseCase from "./find-invoice.usecase";

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

const MockRepository = () => {
    return {
      find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
      add: jest.fn(),
    };
  };

describe("FindInvoiceUseCase unit test", () => {
    it("should find an invoice", async () => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);

        const result = await usecase.execute({ id: "999" });

        expect(result.id).toEqual(invoice.id.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address).toEqual(invoice.address);
        expect(result.items).toEqual([
          { id: "1", name: item1.name, price: item1.price },
          { id: "2", name: item2.name, price: item2.price },
        ]);
        expect(result.total).toEqual(item1.price + item2.price);
        expect(result.createdAt).toEqual(invoice.createdAt)
    })
})
