"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  categories as seedCategories,
  companySettings as seedCompanySettings,
  movements as seedMovements,
  products as seedProducts,
  suppliers as seedSuppliers,
  users,
  warehouses as seedWarehouses,
} from "@/data/mock-data";
import type {
  Category,
  CompanySettings,
  InventoryMovement,
  MovementInput,
  Product,
  ProductInput,
  Supplier,
  Warehouse,
} from "@/types/inventory";

type InventoryContextValue = {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  warehouses: Warehouse[];
  movements: InventoryMovement[];
  users: typeof users;
  settings: CompanySettings;
  addProduct: (input: ProductInput) => Product;
  updateProduct: (id: string, input: ProductInput) => void;
  deleteProduct: (id: string) => void;
  addMovement: (input: MovementInput) => void;
  addCategory: (name: string, description: string) => void;
  updateCategory: (id: string, name: string, description: string) => void;
  deleteCategory: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, supplier: Omit<Supplier, "id">) => void;
  deleteSupplier: (id: string) => void;
  updateSettings: (settings: CompanySettings) => void;
  getProduct: (id: string) => Product | undefined;
  categoryName: (id: string) => string;
  supplierName: (id: string) => string;
  warehouseName: (id: string) => string;
  userName: (id: string) => string;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

function stockStatus(stock: number, minimum: number): Product["status"] {
  if (stock <= 0) return "Sin stock";
  if (stock <= minimum) return "Bajo stock";
  return "Activo";
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(seedCategories);
  const [suppliers, setSuppliers] = useState(seedSuppliers);
  const [warehouses] = useState(seedWarehouses);
  const [movements, setMovements] = useState(seedMovements);
  const [settings, setSettings] = useState(seedCompanySettings);

  const value = useMemo<InventoryContextValue>(() => {
    const addProduct = (input: ProductInput) => {
      const product: Product = {
        ...input,
        id: id("prd"),
        status: stockStatus(input.currentStock, input.minimumStock),
      };
      setProducts((current) => [product, ...current]);
      return product;
    };

    const updateProduct = (productId: string, input: ProductInput) => {
      setProducts((current) =>
        current.map((product) =>
          product.id === productId
            ? { ...product, ...input, status: stockStatus(input.currentStock, input.minimumStock) }
            : product,
        ),
      );
    };

    const deleteProduct = (productId: string) => {
      setProducts((current) => current.filter((product) => product.id !== productId));
      setMovements((current) => current.filter((movement) => movement.productId !== productId));
    };

    const addMovement = (input: MovementInput) => {
      const movement: InventoryMovement = { ...input, id: id("mov") };
      setMovements((current) => [movement, ...current]);
      setProducts((current) =>
        current.map((product) => {
          if (product.id !== input.productId) return product;
          const nextStock =
            input.type === "entrada"
              ? product.currentStock + input.quantity
              : input.type === "salida"
                ? Math.max(0, product.currentStock - input.quantity)
                : input.quantity;
          return { ...product, currentStock: nextStock, status: stockStatus(nextStock, product.minimumStock) };
        }),
      );
    };

    return {
      products,
      categories,
      suppliers,
      warehouses,
      movements,
      users,
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      addMovement,
      addCategory: (name, description) =>
        setCategories((current) => [{ id: id("cat"), name, description }, ...current]),
      updateCategory: (categoryId, name, description) =>
        setCategories((current) =>
          current.map((category) => (category.id === categoryId ? { ...category, name, description } : category)),
        ),
      deleteCategory: (categoryId) =>
        setCategories((current) => current.filter((category) => category.id !== categoryId)),
      addSupplier: (supplier) => setSuppliers((current) => [{ ...supplier, id: id("sup") }, ...current]),
      updateSupplier: (supplierId, supplier) =>
        setSuppliers((current) =>
          current.map((item) => (item.id === supplierId ? { ...item, ...supplier } : item)),
        ),
      deleteSupplier: (supplierId) => setSuppliers((current) => current.filter((item) => item.id !== supplierId)),
      updateSettings: setSettings,
      getProduct: (productId) => products.find((product) => product.id === productId),
      categoryName: (categoryId) => categories.find((category) => category.id === categoryId)?.name ?? "Sin categoría",
      supplierName: (supplierId) => suppliers.find((supplier) => supplier.id === supplierId)?.name ?? "Sin proveedor",
      warehouseName: (warehouseId) =>
        warehouses.find((warehouse) => warehouse.id === warehouseId)?.name ?? "Sin almacén",
      userName: (userId) => users.find((user) => user.id === userId)?.name ?? "Usuario",
    };
  }, [categories, movements, products, settings, suppliers, warehouses]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory debe usarse dentro de InventoryProvider");
  }
  return context;
}
