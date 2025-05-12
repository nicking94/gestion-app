"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Client, ClientFormValues } from "../types/types";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, "id">) => void;
  initialData?: ClientFormValues;
}

export default function ClientForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<ClientFormValues>();
  const [isMounted, setIsMounted] = useState(false);

  // Convertir Client a ClientFormValues

  useEffect(() => {
    setIsMounted(true);
    return () => {
      reset();
      clearErrors();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset(
        initialData || {
          status: "activo",
          planType: "mensual",
        }
      );
      clearErrors();
    }
  }, [isOpen, initialData, reset, clearErrors]);

  const handleFormSubmit = (data: ClientFormValues) => {
    const adjustForTimezone = (dateString: string) => {
      const date = new Date(dateString);
      return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    };

    const clientData: Omit<Client, "id"> = {
      businessName: data.businessName,
      ownerName: data.ownerName,
      phone: data.phone,
      email: data.email,
      status: data.status,
      planType: data.planType,
      saleDate: adjustForTimezone(data.saleDate),
      paymentDate: adjustForTimezone(data.paymentDate),
    };
    onSubmit(clientData);
  };

  if (!isMounted) return null;

  const handleClickOutside = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }
  };

  return (
    <div
      className={`text-black fixed inset-0 z-50 ${
        isOpen ? "flex" : "hidden"
      } items-center justify-center p-4`}
      onClick={handleClickOutside}
    >
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md bg-white rounded-lg shadow-xl min-w-[40rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {initialData ? "Editar Cliente" : "Agregar Nuevo Cliente"}
          </h3>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-4 space-y-4"
        >
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de la Empresa/Negocio
            </label>
            <input
              id="businessName"
              type="text"
              {...register("businessName", {
                required: "Este campo es requerido",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.businessName ? "border-red-500" : "border"
              }`}
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.businessName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ownerName"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Dueño
            </label>
            <input
              id="ownerName"
              type="text"
              {...register("ownerName", {
                required: "Este campo es requerido",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.ownerName ? "border-red-500" : "border"
              }`}
            />
            {errors.ownerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ownerName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone", { required: "Este campo es requerido" })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.phone ? "border-red-500" : "border"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.email ? "border-red-500" : "border"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Estado del Cliente
            </label>
            <select
              id="status"
              defaultValue={initialData?.status || "activo"}
              {...register("status")}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="planType"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Plan
            </label>
            <select
              id="planType"
              defaultValue={initialData?.planType || "mensual"}
              {...register("planType")}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
              <option value="permanente">Permanente</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="saleDate"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Venta
            </label>
            <input
              id="saleDate"
              type="date"
              {...register("saleDate", { required: "Este campo es requerido" })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.saleDate ? "border-red-500" : "border"
              }`}
            />
            {errors.saleDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.saleDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentDate"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Cobro
            </label>
            <input
              id="paymentDate"
              type="date"
              {...register("paymentDate", {
                required: "Este campo es requerido",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.paymentDate ? "border-red-500" : "border"
              }`}
            />
            {errors.paymentDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.paymentDate.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {initialData ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
