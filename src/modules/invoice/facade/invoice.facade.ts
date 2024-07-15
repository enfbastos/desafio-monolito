import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    findInvoice: UseCaseInterface;
    generateInvoice: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findInvoice: UseCaseInterface;
    private _generateInvoice: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._findInvoice = usecaseProps.findInvoice;
        this._generateInvoice = usecaseProps.generateInvoice;
    }

    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return await this._findInvoice.execute(input);
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateInvoice.execute(input);
    }
}
