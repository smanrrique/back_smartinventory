import { Product } from '../domain/entities/product';

describe('Test', () => {

    const crearProductoPrueba = (overrides = {}): Product => {
        return new Product(
            'prod-001',
            'SKU-000001',
            'Producto Test',
            'Descripción del producto',
            'Electrónica',
            100.00,  // Precio
            50.00,   // costo
            10,      // stock actual
            2,       // stock reservado
            5,       // stock mínimo
            true,    // activo
            0        // version
        );
    };

    describe('descontarStock()', () => {

        it('debe descontar stock correctamente cuando hay suficiente inventario', () => {

            const producto = crearProductoPrueba();
            const cantidadADescontar = 3;

            producto.descontarStock(cantidadADescontar);

            expect(producto.currentStock).toBe(7);
        });

        it('debe incrementar la version despues de descontar stock', () => {
            const producto = crearProductoPrueba();
            const versionInicial = producto.version;
            producto.descontarStock(1);
            expect(producto.version).toBe(versionInicial + 1);
        });
    });

    describe('obtenerStockDisponible()', () => {

        it('debe calcular correctamente el stock disponible despues de una venta', () => {

            const producto = crearProductoPrueba();
            const stockDisponible = producto.obtenerStockDisponible();
            expect(stockDisponible).toBe(10);

            const cantidadADescontar = 3;

            producto.descontarStock(cantidadADescontar);
            expect(producto.currentStock).toBe(7);
        });
    });
});
