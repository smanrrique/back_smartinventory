import { Sale } from '../entities/sale';

export interface ISaleRepository {
  guardar(venta: Sale): Promise<Sale>;
}
