import mongoose, { Schema, Document } from 'mongoose';

export interface ICurrency extends Document {
  moeda: string;
  código_iso: string;
  fórmula_atualizada: string;
  exemplo_de_cotação: string;
  timestamp: Date;
}

const currencySchema = new Schema({
  moeda: { type: String, required: true },
  código_iso: { type: String, required: true, unique: true },
  fórmula_atualizada: { type: String, required: true },
  exemplo_de_cotação: { type: String, required: true },
  timestamp: { type: Date, required: true }
});

export const Currency = mongoose.model<ICurrency>('Currency', currencySchema);