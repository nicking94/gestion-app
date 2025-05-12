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
export interface ClientFormValues {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  status: ClientStatus;
  planType: PlanType;
  saleDate: string;
  paymentDate: string;
}
export type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  px?: string;
  py?: string;
  width?: string;
  minwidth?: string;
  height?: string;
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  colorText?: string;
  colorBg?: string;
  colorBgHover?: string;
  colorTextHover?: string;
  disabled?: boolean;
  hotkey?: string;
};
export type NotificationProps = {
  isOpen: boolean;
  onClose?: () => void;
  message: string;
  type: "success" | "error" | "info";
};
