import express, { Application } from 'express';
import cors from 'cors';
import { conectarBaseDatos } from './config/database/connection';
import { crearRutasProducto } from './presentation/http/routes/product-routes';
import { crearRutasVenta } from './presentation/http/routes/sale-routes';

const app: Application = express();

// Se hace uso de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

app.options('*', cors());

app.use(express.json());

const inicializarAplicacion = async () => {
  try {
    await conectarBaseDatos();
    console.log('Base de datos conectada correctamente');

    app.use('/api/products', crearRutasProducto());
    app.use('/api/sales', crearRutasVenta());

    const puerto = process.env.PORT || 3000;
    app.listen(puerto, () => {
      console.log(`Servidor ejecutándose en puerto ${puerto}`);
    });
  } catch (error) {
    console.error('Error al inicializar la aplicacion:', error);
    process.exit(1);
  }
};

inicializarAplicacion();
