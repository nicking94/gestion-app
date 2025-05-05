// types.ts
export type ClientStatus = "activo" | "inactivo" | "pendiente";
export type PlanType = "mensual" | "anual" | "permanente";

export interface Client {
  id?: number;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  status: ClientStatus;
  planType: PlanType;
  saleDate: Date;
  paymentDate: Date;
}

export interface ClientFormData
  extends Omit<Client, "id" | "saleDate" | "paymentDate"> {
  saleDate: string;
  paymentDate: string;
}
