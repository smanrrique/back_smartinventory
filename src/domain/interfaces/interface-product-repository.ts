import { Product } from '../entities/product';

export interface IProductRepository {
  obtenerById(id: string): Promise<Product | null>;
  obtenerBySku(sku: string): Promise<Product | null>;
  buscar(value: string, pagina: number, limite: number): Promise<{ data: Product[], total: number}>;
  obtenerTodos(pagina: number, limite: number): Promise<{ data: Product[], total: number}>;
  actualizarStock(id: string, cantidad: number, versionEsperada: number): Promise<Product>;
  guardar(producto: Product): Promise<Product>;
}
