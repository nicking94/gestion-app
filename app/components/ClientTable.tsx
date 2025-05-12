"use client";

import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Client } from "../types/types";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

export default function ClientTable({
  clients,
  onEdit,
  onDelete,
}: ClientTableProps) {
  // Función para asegurar que tenemos un objeto Date válido
  const ensureDate = (dateInput: Date | string): Date => {
    // Si ya es un Date, lo devolvemos
    if (dateInput instanceof Date) return dateInput;

    // Si es un string ISO (termina con Z)
    if (typeof dateInput === "string" && dateInput.endsWith("Z")) {
      return new Date(dateInput);
    }

    // Para otros casos (como timestamps o strings no ISO)
    const date = new Date(dateInput);

    // Verificamos que sea una fecha válida
    if (isNaN(date.getTime())) {
      console.error("Fecha inválida:", dateInput);
      return new Date(); // Devolver fecha actual como fallback
    }

    return date;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dueño
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Venta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Cobro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => {
              // Aseguramos que las fechas sean objetos Date válidos
              const saleDate = ensureDate(client.saleDate);
              const paymentDate = ensureDate(client.paymentDate);
              const isPaymentToday = isToday(paymentDate);

              return (
                <tr
                  key={client.id}
                  className={isPaymentToday ? "bg-yellow-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.businessName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.ownerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        client.status === "activo"
                          ? "bg-green-100 text-green-800"
                          : client.status === "inactivo"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {client.planType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(saleDate, "dd MMM yyyy", { locale: es })}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      isPaymentToday
                        ? "text-red-600 font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {format(paymentDate, "dd MMM yyyy", { locale: es })}
                    {isPaymentToday && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        HOY
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(client)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => client.id && onDelete(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
