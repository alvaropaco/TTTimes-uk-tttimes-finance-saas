import mongoose from "mongoose"

const currencySchema = new mongoose.Schema({
  moeda: {
    type: String,
    required: true,
  },
  código_iso: {
    type: String,
    required: true,
    unique: true,
  },
  fórmula_atualizada: {
    type: String,
    required: true,
  },
  exemplo_de_cotação: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

export const Currency = mongoose.models.Currency || mongoose.model("Currency", currencySchema)