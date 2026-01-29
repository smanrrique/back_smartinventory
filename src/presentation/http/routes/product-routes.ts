import express, { Request, Response, Router } from 'express';
import { ProductMongoRepository } from '../../../infrastructure/persistence/product-mongo-repository';
import {
  GetProductByIdUseCase,
  BuscarProductsUseCase,
  ListarProductsUseCase,
} from '../../../application/use-cases/product-use-cases';

export const crearRutasProducto = (): Router => {
  const router = express.Router();
  const repositorio = new ProductMongoRepository();

  const useCaseObtener = new GetProductByIdUseCase(repositorio);
  const casoUsoBuscar = new BuscarProductsUseCase(repositorio);
  const casoUsoListar = new ListarProductsUseCase(repositorio);

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const producto = await useCaseObtener.ejecutar(req.params.id);
      res.json(producto);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const value = req.query.value as string;
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 20;

      if (value) {
        //Se usa para buscar nuevas paginas
        const resultado = await casoUsoBuscar.ejecutar(value, pagina, limite);
        res.json(resultado);
      } else {
        //Buscar todos cuando no hay un filtro
        const resultado = await casoUsoListar.ejecutar(pagina, limite);
        
        res.json(resultado);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });


  return router;
};
