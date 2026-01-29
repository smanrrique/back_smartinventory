import express, { Request, Response, Router } from 'express';
import { ProductMongoRepository } from '../../../infrastructure/persistence/product-mongo-repository';
import { SaleMongoRepository } from '../../../infrastructure/persistence/sale-mongo-repository';
import { CreateSaleUseCase } from '../../../application/use-cases/sale-use-cases';

export const crearRutasVenta = (): Router => {
  const router = express.Router();
  const repositorioProducto = new ProductMongoRepository();
  const repositorioVenta = new SaleMongoRepository();

  const casoUsoCrearVenta = new CreateSaleUseCase(repositorioVenta, repositorioProducto);

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { idProducto, cantidad, sucursal } = req.body;

      if (!idProducto || !cantidad || !sucursal) {
        res.status(400).json({ error: 'Parametros requeridos: idProducto, cantidad, sucursal' });
        return;
      }

      const venta = await casoUsoCrearVenta.ejecutar(idProducto, cantidad, sucursal);
      res.status(201).json(venta);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
