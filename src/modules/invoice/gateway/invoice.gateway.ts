import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
    find(id: string): Promise<Invoice>;
    add(invoice: Invoice): Promise<void>;
}