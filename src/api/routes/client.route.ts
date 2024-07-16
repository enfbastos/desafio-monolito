import express, { Request, Response } from "express";

import { AddClientFacadeInputDto } from "../../modules/client-adm/facade/client-adm.facade.interface";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const facade = ClientAdmFacadeFactory.create();

  try {
    const clientDto: AddClientFacadeInputDto = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: req.body.address,
    };

    await facade.add(clientDto);

    res.status(201).send();
  } catch (error) {
    res.status(400).send(error);
  }
});
