"use client";

import { useRef, useState } from "react";
import Button from "@/app/components/Button";
import { FolderUp, FolderDown } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import Notification from "@/app/components/Notification";
import { db } from "../database/db";

interface ImportExportButtonsProps {
  onImportSuccess?: () => void;
}

export default function ImportExportButtons({
  onImportSuccess,
}: ImportExportButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const clients = useLiveQuery(() => db.clients.toArray());

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileText = await file.text();
      const data = JSON.parse(fileText);

      // Validar estructura de datos
      if (!Array.isArray(data)) {
        throw new Error("El archivo debe contener un array de clientes");
      }

      // Limpiar la base de datos actual
      await db.clients.clear();

      // Preparar datos para importación (convertir strings de fecha a objetos Date)
      const clientsToImport = data.map((client) => ({
        ...client,
        saleDate: client.saleDate ? new Date(client.saleDate) : new Date(),
        paymentDate: client.paymentDate
          ? new Date(client.paymentDate)
          : new Date(),
      }));

      // Importar nuevos datos
      await db.clients.bulkAdd(clientsToImport);

      setNotification({
        isOpen: true,
        message: "Datos importados correctamente",
        type: "success",
      });

      // Llamar a la función de éxito para actualizar la tabla
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      console.error("Error importing data:", error);
      setNotification({
        isOpen: true,
        message: "Error al importar datos: " + (error as Error).message,
        type: "error",
      });
    } finally {
      // Resetear el input para permitir la misma selección de archivo
      if (e.target) e.target.value = "";
    }
  };

  const handleExport = async () => {
    if (!clients || clients.length === 0) {
      setNotification({
        isOpen: true,
        message: "No hay datos para exportar",
        type: "info",
      });
      return;
    }

    try {
      // Convertir fechas a strings ISO para la exportación
      const dataToExport = clients.map((client) => ({
        ...client,
        saleDate:
          client.saleDate instanceof Date
            ? client.saleDate.toISOString()
            : new Date(client.saleDate).toISOString(),
        paymentDate:
          client.paymentDate instanceof Date
            ? client.paymentDate.toISOString()
            : new Date(client.paymentDate).toISOString(),
      }));

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clientes_exportados_${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setNotification({
        isOpen: true,
        message: "Datos exportados correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      setNotification({
        isOpen: true,
        message: "Error al exportar datos: " + (error as Error).message,
        type: "error",
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        icon={<FolderUp className="w-5 h-5" />}
        text="Importar"
        onClick={handleImportClick}
        colorText="text-white"
        colorTextHover="text-white"
        colorBg="bg-blue-500"
        colorBgHover="hover:bg-blue_m"
      />

      <Button
        icon={<FolderDown className="w-5 h-5" />}
        text="Exportar"
        onClick={handleExport}
        colorText="text-white"
        colorTextHover="text-white"
        colorBg="bg-green-600"
        colorBgHover="hover:bg-green-700"
      />

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileImport}
        className="hidden"
      />

      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </div>
  );
}
