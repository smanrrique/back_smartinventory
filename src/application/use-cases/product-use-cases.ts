import { Product } from '../../domain/entities/product';
import { IProductRepository } from '../../domain/interfaces/interface-product-repository';

export class GetProductByIdUseCase {
  constructor(private repositorio: IProductRepository) {}

  async ejecutar(id: string): Promise<Product> {
    const producto = await this.repositorio.obtenerById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }
}

export class BuscarProductsUseCase {
  constructor(private repositorio: IProductRepository) {}

  async ejecutar(value: string, pagina: number = 1, limite: number = 20): Promise<{ data: Product[], total: number}> {
    if (pagina < 1 || limite < 1 || limite > 100) {
      throw new Error('Parametros de paginacion invalidos');
    }
    return this.repositorio.buscar(value, pagina, limite);
  }
}

export class ListarProductsUseCase {
  constructor(private repositorio: IProductRepository) {}

  async ejecutar(pagina: number = 1, limite: number = 20): Promise<{ data: Product[], total: number }> {
    if (pagina < 1 || limite < 1 || limite > 100) {
      throw new Error('Parametros de paginacion invalidos');
    }
    return this.repositorio.obtenerTodos(pagina, limite);
  }
}

