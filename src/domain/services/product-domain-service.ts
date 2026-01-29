import { Product } from '../entities/product';
import { IProductRepository } from '../interfaces/interface-product-repository';

export class ProductDomainService {
  constructor(private repositorio: IProductRepository) {}

  async descontarStockSeguro(idProducto: string, cantidad: number): Promise<Product> {
    let producto = await this.repositorio.obtenerById(idProducto);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (producto.currentStock < cantidad) {
      throw new Error(`Stock insuficiente. Disponible: ${producto.currentStock}, Solicitado: ${cantidad}`);
    }

    const versionActual = producto.version;
    producto.descontarStock(cantidad);

    try {
      const productoActualizado = await this.repositorio.actualizarStock(
        idProducto,
        cantidad,
        versionActual
      );
      return productoActualizado;
    } catch (error) {
      throw new Error('No se pudo actualizar el stock. Intenta de nuevo.');
    }
  }
}
