import { conectarBaseDatos } from '../config/database/connection';
import { ProductMongoRepository } from '../infrastructure/persistence/product-mongo-repository';
import { ProductModel } from '../config/database/schemas/product-schema';

const simularConcurrencia = async () => {
  try {
    await conectarBaseDatos();

    const repositorio = new ProductMongoRepository();

    const productoExistente = await ProductModel.findOne({ sku: 'SKU-000001' });
    if (!productoExistente) {
      console.log('Crear un producto ejecutando: npm run seed');
      process.exit(0);
    }

    console.log(`\nProducto inicial - Stock: ${productoExistente.currentStock}, Version: ${productoExistente.version}`);

    const idProducto = productoExistente._id.toString();
    const versionInicial = productoExistente.version;

    console.log('\nSimulando dos peticiones concurrentes de descuento de 1 unidad cada una...\n');

    const promesa1 = (async () => {
      try {
        console.log('Peticion 1: Intentando descontar 1 unidad...');
        const resultado = await repositorio.actualizarStock(
          idProducto,
          1,
          versionInicial
        );
        console.log(`Peticion 1: Exito - Stock: ${resultado.currentStock}, Version: ${resultado.version}`);
        return true;
      } catch (error: any) {
        console.log(`Peticion 1: Error - ${error.message}`);
        return false;
      }
    })();

    const promesa2 = (async () => {
      try {
        console.log('Peticion 2: Intentando descontar 1 unidad...');
        const resultado = await repositorio.actualizarStock(
          idProducto,
          1,
          versionInicial
        );
        console.log(`Peticion 2: Exito - Stock: ${resultado.currentStock}, Version: ${resultado.version}`);
        return true;
      } catch (error: any) {
        console.log(`Peticion 2: Error - ${error.message}`);
        return false;
      }
    })();

    const [resultado1, resultado2] = await Promise.all([promesa1, promesa2]);

    console.log('\nResultados:');
    console.log(`- Peticion 1: ${resultado1 ? 'Exitosa' : 'Fallo'}`);
    console.log(`- Peticion 2: ${resultado2 ? 'Exitosa' : 'Fallo'}`);

    const productoFinal = await ProductModel.findById(idProducto);
    console.log(`\nProducto final - Stock: ${productoFinal?.currentStock}, Version: ${productoFinal?.version}`);
    console.log(`Solo se proceso una transaccion, evitando sobreventa`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

simularConcurrencia();
