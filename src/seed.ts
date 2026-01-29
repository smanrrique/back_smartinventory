import { conectarBaseDatos } from './config/database/connection';
import { ProductModel } from './config/database/schemas/product-schema';

// Datos para generar productos variados
const marcas = ['LG', 'Samsung', 'Sony', 'Apple', 'Adidas', 'Nike', 'HP', 'Dell', 'Lenovo', 'Asus'];
const categorias = ['Electronica', 'Ropa', 'Deportes', 'Hogar', 'Libros', 'Juguetes', 'Tecnología', 'Accesorios'];

// Generar número aleatorio entre min y max
const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;



// Formatear SKU con ceros a la izquierda (SKU-000001, SKU-000002, etc.)
const formatSku = (num: number): string => `SKU-${num.toString().padStart(6, '0')}`;
// Generar productos para prueba de rendimiento y concurrencia 
const generarProducto = (index: number) => {
    const marca = marcas[randomInt(0, marcas.length - 1)];
    const categoria = categorias[randomInt(0, categorias.length - 1)];
    //Numero aleatorio entre 10 y 1000
    const precio = parseFloat((Math.random() * (1000 - 10) + 10).toFixed(2));
    //Numero aleatorio entre 5 y el 8% del precio, esto con el fin de que el costo sea menor al precio
    const costo = parseFloat((Math.random() * ((precio * 0.8) - 5) + 5).toFixed(2));

    return {
        sku: formatSku(index),
        name: `${marca} Producto ${index}`,
        description: `Descripcion detallada del producto ${index}. Esta es una prueba con 50,000 SKUs para verificar rendimiento.`,
        category: categoria,
        price: precio,
        cost: costo,
        currentStock: randomInt(0, 1000),
        reservedStock: randomInt(0, 100),
        minStock: randomInt(5, 50),
        active: true,
        version: 0,
    };
};

const seed = async () => {
    const TOTAL_PRODUCTOS = 50000;
    const LOTES = 1000; // Insertar en lotes de 1000 para mejor rendimiento

    try {
        await conectarBaseDatos();
        console.log('Conexion ok\n');

        const countExistente = await ProductModel.countDocuments();
        if (countExistente > 0) {
            console.log('Ya existen productos en la base de datos.');
            process.exit(0);
        }

        console.log('Generando productos...');

        for (let i = 0; i < TOTAL_PRODUCTOS; i += LOTES) {
            const batch = [];
            const batchEnd = Math.min(i + LOTES, TOTAL_PRODUCTOS);

            for (let j = i + 1; j <= batchEnd; j++) {
                batch.push(generarProducto(j));
            }
            await ProductModel.insertMany(batch);
        }

        // Mostrar ejemplo de producto creado
        const ejemplo = await ProductModel.findOne({ sku: 'SKU-000001' });
        if (ejemplo) {
            console.log('Ejemplo de producto creado:');
            console.log(JSON.stringify(ejemplo.toObject(), null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
};

seed();
