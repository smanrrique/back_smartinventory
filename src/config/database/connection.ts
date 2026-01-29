import mongoose from 'mongoose';

export const conectarBaseDatos = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartinventory';
  
  await mongoose.connect(uri);
};
