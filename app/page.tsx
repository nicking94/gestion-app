// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Client } from "./types/types";
import { db } from "./database/db";
import ClientTable from "./components/ClientTable";
import ClientForm from "./components/ClientForm";
import logo from "../public/images/logo.png";
import Image from "next/image";

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar clientes desde Dexie al iniciar
  useEffect(() => {
    const loadClients = async () => {
      try {
        const allClients = await db.clients.toArray();
        setClients(allClients);
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleAddClient = async (formData: Omit<Client, "id">) => {
    try {
      const id = await db.clients.add({
        ...formData,
        // Las fechas ya vienen como objetos Date correctos desde ClientForm
        saleDate: formData.saleDate,
        paymentDate: formData.paymentDate,
      });

      setClients([...clients, { ...formData, id: id as number }]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleUpdateClient = async (formData: Omit<Client, "id">) => {
    if (!editingClient?.id) return;

    try {
      await db.clients.update(editingClient.id, {
        ...formData,
        saleDate: formData.saleDate,
        paymentDate: formData.paymentDate,
      });

      setClients(
        clients.map((client) =>
          client.id === editingClient.id
            ? { ...formData, id: editingClient.id }
            : client
        )
      );
      setEditingClient(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await db.clients.delete(id);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  // Ordenar clientes por fecha de cobro (más próximos primero)
  const sortedClients = [...clients].sort(
    (a, b) =>
      new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex gap-4 items-center mb-8">
          <Image src={logo} alt="Logo" width={40} height={40} />
          <h1 className="italic text-2xl font-bold text-gray-800">
            Universal Web - Gestión de Clientes
          </h1>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Lista de Clientes
          </h2>
          <button
            onClick={() => {
              setEditingClient(null);
              setIsFormOpen(true);
            }}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Cliente +
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center ">
            <p className="text-gray-500 ">No hay clientes registrados aún</p>
          </div>
        ) : (
          <ClientTable
            clients={sortedClients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        )}

        <ClientForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={editingClient ? handleUpdateClient : handleAddClient}
          initialData={
            editingClient
              ? {
                  businessName: editingClient.businessName,
                  ownerName: editingClient.ownerName,
                  phone: editingClient.phone,
                  email: editingClient.email,
                  status: editingClient.status,
                  planType: editingClient.planType,
                  saleDate: format(editingClient.saleDate, "yyyy-MM-dd"),
                  paymentDate: format(editingClient.paymentDate, "yyyy-MM-dd"),
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
