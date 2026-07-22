import type {
  Category,
  CompanySettings,
  InventoryMovement,
  Product,
  Supplier,
  User,
  Warehouse,
} from "@/types/inventory";

export const categories: Category[] = [
  { id: "cat-1", name: "Ferretería", description: "Herramientas manuales, eléctricas y artículos de alta rotación." },
  { id: "cat-2", name: "Construcción", description: "Cemento, pinturas, selladores y materiales para obra." },
  { id: "cat-3", name: "Gasfitería", description: "Tuberías, conexiones, llaves y accesorios sanitarios." },
  { id: "cat-4", name: "Oficina", description: "Insumos administrativos, tecnología y consumibles." },
  { id: "cat-5", name: "Seguridad industrial", description: "EPP, señalización y equipos para operación en campo." },
];

export const suppliers: Supplier[] = [
  { id: "sup-1", name: "Comercial Andina EIRL", contact: "Rosa Villanueva", phone: "+51 987 456 210", email: "ventas@comercialandina.pe", status: "Activo" },
  { id: "sup-2", name: "Industrias Pacífico SAC", contact: "Carlos Medina", phone: "+51 956 224 781", email: "pedidos@industriaspacifico.pe", status: "Activo" },
  { id: "sup-3", name: "Grupo Andino Logistics", contact: "Mariela Salas", phone: "+51 944 782 119", email: "operaciones@grupoandino.pe", status: "Activo" },
  { id: "sup-4", name: "Inversiones Santa María SAC", contact: "Jorge Paredes", phone: "+51 973 615 402", email: "compras@santamaria.pe", status: "En revisión" },
  { id: "sup-5", name: "Suministros del Norte SAC", contact: "Patricia Benavides", phone: "+51 949 331 608", email: "cotizaciones@suministrosnorte.pe", status: "Activo" },
];

export const warehouses: Warehouse[] = [
  { id: "wh-1", name: "Almacén Lima Este", location: "Av. Separadora Industrial 1865, Ate, Lima", manager: "Andrea Vargas", status: "Operativo" },
  { id: "wh-2", name: "Centro Trujillo", location: "Av. América Sur 2450, Trujillo, La Libertad", manager: "Roberto León", status: "Operativo" },
  { id: "wh-3", name: "Almacén Arequipa", location: "Vía Evitamiento km 5.5, Cerro Colorado, Arequipa", manager: "Nadia Cueva", status: "Mantenimiento" },
];

export const users: User[] = [
  { id: "usr-1", name: "Daniel Rivas", role: "Administrador" },
  { id: "usr-2", name: "Sofía Peña", role: "Compras" },
  { id: "usr-3", name: "Mateo Ruiz", role: "Operaciones" },
  { id: "usr-4", name: "Valeria Córdova", role: "Supervisora de almacén" },
];

export const products: Product[] = [
  { id: "prd-1", name: "Taladro Bosch GSB 13 RE", sku: "FER-TAL-BOS13", categoryId: "cat-1", supplierId: "sup-1", warehouseId: "wh-1", unit: "unidad", currentStock: 38, minimumStock: 15, unitCost: 249.9, salePrice: 329.9, status: "Activo" },
  { id: "prd-2", name: "Cemento Sol Tipo I 42.5 kg", sku: "CON-CEM-SOL425", categoryId: "cat-2", supplierId: "sup-2", warehouseId: "wh-2", unit: "bolsa", currentStock: 84, minimumStock: 120, unitCost: 25.8, salePrice: 31.5, status: "Bajo stock" },
  { id: "prd-3", name: "Pintura CPP Látex Blanco 1 gal", sku: "CON-PIN-CPP1G", categoryId: "cat-2", supplierId: "sup-2", warehouseId: "wh-1", unit: "galón", currentStock: 146, minimumStock: 60, unitCost: 39.9, salePrice: 55.0, status: "Activo" },
  { id: "prd-4", name: "Llave Stilson 14 pulgadas", sku: "FER-LLA-STI14", categoryId: "cat-1", supplierId: "sup-1", warehouseId: "wh-2", unit: "unidad", currentStock: 18, minimumStock: 35, unitCost: 58.5, salePrice: 82.0, status: "Bajo stock" },
  { id: "prd-5", name: "Tubo PVC Pavco 1/2 pulg.", sku: "GAS-TUB-PVC12", categoryId: "cat-3", supplierId: "sup-4", warehouseId: "wh-1", unit: "tubo", currentStock: 310, minimumStock: 140, unitCost: 7.2, salePrice: 10.9, status: "Activo" },
  { id: "prd-6", name: "Papel Bond A4 75 g millar", sku: "OFI-PAP-A475", categoryId: "cat-4", supplierId: "sup-5", warehouseId: "wh-2", unit: "millar", currentStock: 64, minimumStock: 50, unitCost: 18.9, salePrice: 26.5, status: "Activo" },
  { id: "prd-7", name: "Tóner HP 85A compatible", sku: "OFI-TON-HP85A", categoryId: "cat-4", supplierId: "sup-5", warehouseId: "wh-1", unit: "unidad", currentStock: 9, minimumStock: 20, unitCost: 88.0, salePrice: 129.0, status: "Bajo stock" },
  { id: "prd-8", name: "Casco de seguridad 3M blanco", sku: "SEG-CAS-3MB", categoryId: "cat-5", supplierId: "sup-3", warehouseId: "wh-3", unit: "unidad", currentStock: 72, minimumStock: 50, unitCost: 34.5, salePrice: 49.9, status: "Activo" },
  { id: "prd-9", name: "Guantes de nitrilo caja 100 unid.", sku: "SEG-GUA-NIT100", categoryId: "cat-5", supplierId: "sup-3", warehouseId: "wh-3", unit: "caja", currentStock: 0, minimumStock: 45, unitCost: 31.0, salePrice: 46.9, status: "Sin stock" },
  { id: "prd-10", name: "Chaleco reflectivo naranja", sku: "SEG-CHA-REFN", categoryId: "cat-5", supplierId: "sup-3", warehouseId: "wh-2", unit: "unidad", currentStock: 42, minimumStock: 80, unitCost: 16.5, salePrice: 24.9, status: "Bajo stock" },
];

export const movements: InventoryMovement[] = [
  { id: "mov-1", productId: "prd-1", type: "entrada", quantity: 24, date: "2026-07-02", userId: "usr-2", reason: "Reposición por campaña de temporada", warehouseId: "wh-1" },
  { id: "mov-2", productId: "prd-2", type: "salida", quantity: 90, date: "2026-07-03", userId: "usr-3", reason: "Despacho a obra en Chiclayo", warehouseId: "wh-2" },
  { id: "mov-3", productId: "prd-4", type: "salida", quantity: 22, date: "2026-07-04", userId: "usr-3", reason: "Pedido mayorista Piura", warehouseId: "wh-2" },
  { id: "mov-4", productId: "prd-7", type: "ajuste", quantity: 9, date: "2026-07-05", userId: "usr-4", reason: "Conteo físico de consumibles", warehouseId: "wh-1" },
  { id: "mov-5", productId: "prd-8", type: "entrada", quantity: 60, date: "2026-07-05", userId: "usr-2", reason: "Abastecimiento de EPP", warehouseId: "wh-3" },
  { id: "mov-6", productId: "prd-9", type: "salida", quantity: 45, date: "2026-07-06", userId: "usr-3", reason: "Atención a cliente industrial en Arequipa", warehouseId: "wh-3" },
  { id: "mov-7", productId: "prd-10", type: "salida", quantity: 38, date: "2026-07-06", userId: "usr-4", reason: "Entrega para cuadrillas de mantenimiento", warehouseId: "wh-2" },
  { id: "mov-8", productId: "prd-3", type: "entrada", quantity: 80, date: "2026-06-22", userId: "usr-2", reason: "Compra mensual de pinturas", warehouseId: "wh-1" },
  { id: "mov-9", productId: "prd-5", type: "salida", quantity: 95, date: "2026-06-24", userId: "usr-3", reason: "Despacho a contratista en Lima Norte", warehouseId: "wh-1" },
  { id: "mov-10", productId: "prd-6", type: "entrada", quantity: 120, date: "2026-05-18", userId: "usr-2", reason: "Reposición para oficinas administrativas", warehouseId: "wh-2" },
  { id: "mov-11", productId: "prd-1", type: "salida", quantity: 16, date: "2026-04-15", userId: "usr-3", reason: "Venta corporativa Cusco", warehouseId: "wh-1" },
  { id: "mov-12", productId: "prd-8", type: "entrada", quantity: 40, date: "2026-03-12", userId: "usr-2", reason: "Compra trimestral de seguridad", warehouseId: "wh-3" },
  { id: "mov-13", productId: "prd-2", type: "salida", quantity: 70, date: "2026-02-08", userId: "usr-3", reason: "Abastecimiento a distribuidor Trujillo", warehouseId: "wh-2" },
];

export const companySettings: CompanySettings = {
  companyName: "Distribuidora Ferretera Norte SAC",
  brand: "Bananas4Monkeys",
  currency: "PEN",
  defaultUnit: "unidad",
  globalMinimumStock: 50,
  compactTables: false,
  showStockWarnings: true,
};
