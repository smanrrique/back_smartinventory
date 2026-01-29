export class Sale {
  id: string;
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  branch: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;

  constructor(
    id: string,
    productId: string,
    sku: string,
    quantity: number,
    unitPrice: number,
    branch: string,
    status: 'pending' | 'completed' | 'failed' = 'pending'
  ) {
    this.id = id;
    this.productId = productId;
    this.sku = sku;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.total = quantity * unitPrice;
    this.branch = branch;
    this.status = status;
    this.createdAt = new Date();
  }

  completar(): void {
    this.status = 'completed';
  }

  fallar(): void {
    this.status = 'failed';
  }
}
