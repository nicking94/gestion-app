// db.ts
import Dexie, { type Table } from "dexie";

export interface Client {
  id?: number;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  status: "activo" | "inactivo" | "pendiente";
  planType: "mensual" | "anual" | "permanente";
  saleDate: Date;
  paymentDate: Date;
}

export class ClientDatabase extends Dexie {
  clients!: Table<Client>;

  constructor() {
    super("ClientManagementDB");
    this.version(1).stores({
      clients: "++id, businessName, ownerName, paymentDate",
    });
  }
}

export const db = new ClientDatabase();
