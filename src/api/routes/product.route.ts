import express, { Request, Response } from "express";

import { AddProductFacadeInputDto } from "../../modules/product-adm/facade/product-adm.facade.interface";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const facade = ProductAdmFacadeFactory.create();

  try {
    const productDto: AddProductFacadeInputDto = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    await facade.addProduct(productDto);

    res.status(201).send();
  } catch (error) {
    res.status(400).send(error);
  }
});
