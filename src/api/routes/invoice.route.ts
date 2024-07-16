import express, { Request, Response } from "express";

import { FindInvoiceFacadeInputDto } from "../../modules/invoice/facade/invoice.facade.interface";
import { InvoiceFacadeFactory } from "../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const facade = InvoiceFacadeFactory.create();

  try {
    const input: FindInvoiceFacadeInputDto = {
      id: req.params.id,
    };

    const invoice = await facade.find(input);

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});
