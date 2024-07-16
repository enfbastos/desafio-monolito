import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { OrderModel } from "../modules/checkout/repository/order.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { ProductModel as AdmProductModel } from "../modules/product-adm/repository/product.model";
import ProductModel from "../modules/store-catalog/repository/product.model";
import { checkoutRoute } from "./routes/checkout.route";
import { clientRoute } from "./routes/client.route";
import { invoiceRoute } from "./routes/invoice.route";
import { productRoute } from "./routes/product.route";


export const app: Express = express();
app.use(express.json());
app.use("/client", clientRoute);
app.use("/product", productRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

export let migration: Umzug<any>;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    ClientModel,
    ProductModel,
    AdmProductModel,
    InvoiceModel,
    TransactionModel,
    OrderModel
  ]);
  await sequelize.sync();
  // migration = migrator(sequelize)
  // await migration.up()
}

setupDb();
