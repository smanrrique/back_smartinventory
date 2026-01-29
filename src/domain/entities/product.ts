export class Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  currentStock: number;
  reservedStock: number;
  minStock: number;
  active: boolean;
  version: number;

  constructor(
    id: string,
    sku: string,
    name: string,
    description: string,
    category: string,
    price: number,
    cost: number,
    currentStock: number,
    reservedStock: number,
    minStock: number,
    active: boolean,
    version: number = 0
  ) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = price;
    this.cost = cost;
    this.currentStock = currentStock;
    this.reservedStock = reservedStock;
    this.minStock = minStock;
    this.active = active;
    this.version = version;
  }

  descontarStock(cantidad: number): void {
    if (cantidad > this.currentStock) {
      throw new Error(`Stock insuficiente. Disponible: ${this.currentStock}, Solicitado: ${cantidad}`);
    }
    this.currentStock -= cantidad;
    this.version += 1;
  }

  aumentarStock(cantidad: number): void {
    this.currentStock += cantidad;
    this.version += 1;
  }

  obtenerStockDisponible(): number {
    return this.currentStock;
  }
}

