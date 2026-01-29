import { Product } from '../../domain/entities/product';
import { IProductRepository } from '../../domain/interfaces/interface-product-repository';
import { ProductModel } from '../../config/database/schemas/product-schema';

export class ProductMongoRepository implements IProductRepository {
  //Buscar producto por ID
  async obtenerById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id);
    return doc ? this.mapearAProducto(doc) : null;
  }

  //Buscar producto por SKU
  async obtenerBySku(sku: string): Promise<Product | null> {
    const doc = await ProductModel.findOne({ sku });
    return doc ? this.mapearAProducto(doc) : null;
  }

  async buscar(
    value: string,
    pagina: number = 1,
    limite: number = 10
  ): Promise<{ data: Product[]; total: number }> {

    const skip = (pagina - 1) * limite;
    const valueFilter = (value ?? '').trim();

    if (!valueFilter) {
      return { data: [], total: 0 };
    }

    //Se usa regex para simular un autocompletado
    const regex = new RegExp(`^${valueFilter}`, 'i');

    const filtro = {
      $or: [
        { name: { $regex: regex } },
        { sku: { $regex: regex } },
      ],
    };

    const [documentos, total] = await Promise.all([
      ProductModel.find(filtro)
        .skip(skip)
        .limit(limite),
      ProductModel.countDocuments(filtro),
    ]);

    return {
      data: documentos.map(doc => this.mapearAProducto(doc)),
      total,
    };
  }


  async obtenerTodos(pagina: number, limite: number): Promise<{ data: Product[], total: number }> {
    const skip = (pagina - 1) * limite;

    const [documentos, total] = await Promise.all([
      ProductModel.find().skip(skip).limit(limite).sort({ sku: 1 }),
      ProductModel.countDocuments(),
    ]);

    return {
      data: documentos.map((doc: any) => this.mapearAProducto(doc)),
      total
    };
  }

  async actualizarStock(id: string, cantidad: number, versionEsperada: number): Promise<Product> {
    const resultado = await ProductModel.findOneAndUpdate(
      { _id: id, version: versionEsperada },
      {
        $inc: { currentStock: - cantidad, version: 1 },
      },
      { new: true }
    );

    if (!resultado) {
      throw new Error('Conflicto de concurrencia: el producto fue modificado. Intenta de nuevo.');
    }

    return this.mapearAProducto(resultado);
  }

  async guardar(producto: Product): Promise<Product> {
    const actualizado = await ProductModel.findByIdAndUpdate(
      producto.id,
      {
        sku: producto.sku,
        name: producto.name,
        description: producto.description,
        category: producto.category,
        price: producto.price,
        cost: producto.cost,
        currentStock: producto.currentStock,
        reservedStock: producto.reservedStock,
        minStock: producto.minStock,
        active: producto.active,
        version: producto.version,
      },
      { new: true }
    );

    if (!actualizado) {
      throw new Error('No se pudo actualizar el producto');
    }

    return this.mapearAProducto(actualizado);
  }

  async crear(producto: Product): Promise<Product> {
    const nuevoProducto = new ProductModel({
      sku: producto.sku,
      name: producto.name,
      description: producto.description,
      category: producto.category,
      price: producto.price,
      cost: producto.cost,
      currentStock: producto.currentStock,
      reservedStock: producto.reservedStock,
      minStock: producto.minStock,
      active: producto.active,
      version: 0,
    });

    const guardado = await nuevoProducto.save();
    return this.mapearAProducto(guardado);
  }

  private mapearAProducto(doc: any): Product {
    return new Product(
      doc._id.toString(),
      doc.sku,
      doc.name,
      doc.description,
      doc.category,
      doc.price,
      doc.cost,
      doc.currentStock,
      doc.reservedStock,
      doc.minStock,
      doc.active,
      doc.version
    );
  }
}
