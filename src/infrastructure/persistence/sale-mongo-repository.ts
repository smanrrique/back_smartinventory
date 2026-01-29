import { Sale } from '../../domain/entities/sale';
import { ISaleRepository } from '../../domain/interfaces/interface-sale-repository';
import { SaleModel } from '../../config/database/schemas/sale-schema';

export class SaleMongoRepository implements ISaleRepository {

  async guardar(venta: Sale): Promise<Sale> {
    const nuevoRegistro = new SaleModel({
      productId: venta.productId,
      sku: venta.sku,
      quantity: venta.quantity,
      unitPrice: venta.unitPrice,
      total: venta.total,
      branch: venta.branch,
      status: venta.status,
    });

    const guardado = await nuevoRegistro.save();
    return this.mapearAVenta(guardado);
  }

  private mapearAVenta(doc: any): Sale {
    const venta = new Sale(
      doc._id.toString(),
      doc.productId,
      doc.sku,
      doc.quantity,
      doc.unitPrice,
      doc.branch,
      doc.status
    );
    venta.createdAt = doc.createdAt;
    return venta;
  }
}
