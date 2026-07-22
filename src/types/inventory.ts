export type ProductStatus = "Activo" | "Bajo stock" | "Sin stock" | "Descontinuado";
export type SupplierStatus = "Activo" | "En revisión" | "Inactivo";
export type WarehouseStatus = "Operativo" | "Mantenimiento" | "Cerrado";
export type MovementType = "entrada" | "salida" | "ajuste";

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: SupplierStatus;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  status: WarehouseStatus;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  supplierId: string;
  warehouseId: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  salePrice: number;
  status: ProductStatus;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  date: string;
  userId: string;
  reason: string;
  warehouseId: string;
}

export interface CompanySettings {
  companyName: string;
  brand: string;
  currency: "PEN";
  defaultUnit: string;
  globalMinimumStock: number;
  compactTables: boolean;
  showStockWarnings: boolean;
}

export type ProductInput = Omit<Product, "id" | "status">;
export type MovementInput = Omit<InventoryMovement, "id">;
