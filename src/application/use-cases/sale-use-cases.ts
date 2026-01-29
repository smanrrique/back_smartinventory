import { Sale } from '../../domain/entities/sale';
import { ISaleRepository } from '../../domain/interfaces/interface-sale-repository';
import { IProductRepository } from '../../domain/interfaces/interface-product-repository';
import { v4 as uuidv4 } from 'uuid';

export class CreateSaleUseCase {
  constructor(
    private repositorioVenta: ISaleRepository,
    private repositorioProducto: IProductRepository
  ) {}

  async ejecutar(
    idProducto: string,
    cantidad: number,
    sucursal: string
  ): Promise<Sale> {
    const producto = await this.repositorioProducto.obtenerById(idProducto);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (producto.currentStock < cantidad) {
      throw new Error('Stock insuficiente. Disponible: ${producto.currentStock}');
    }

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    const versionActual = producto.version;
    producto.descontarStock(cantidad);

    try {
      await this.repositorioProducto.actualizarStock(
        idProducto,
        cantidad,
        versionActual
      );

      const venta = new Sale(
        uuidv4(),
        idProducto,
        producto.sku,
        cantidad,
        producto.price,
        sucursal
      );

      venta.completar();
      return await this.repositorioVenta.guardar(venta);
    } catch (error) {
      throw new Error('No se pudo procesar la venta. Intenta de nuevo.');
    }
  }
}
