const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tttimes-finance"

const sampleCurrencies = [
  {
    moeda: "Rial Saudita",
    código_iso: "SAR",
    fórmula_atualizada: "3,75053961",
    exemplo_de_cotação: "3.75",
    timestamp: new Date(),
  },
  {
    moeda: "Euro",
    código_iso: "EUR",
    fórmula_atualizada: "0,85234",
    exemplo_de_cotação: "0.85",
    timestamp: new Date(),
  },
  {
    moeda: "Libra Esterlina",
    código_iso: "GBP",
    fórmula_atualizada: "0,73456",
    exemplo_de_cotação: "0.73",
    timestamp: new Date(),
  },
  {
    moeda: "Iene Japonês",
    código_iso: "JPY",
    fórmula_atualizada: "110,25",
    exemplo_de_cotação: "110.25",
    timestamp: new Date(),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const collection = db.collection("currencies")

    // Clear existing data (optional)
    await collection.deleteMany({})
    console.log("Cleared existing currencies")

    // Insert sample data
    const result = await collection.insertMany(sampleCurrencies)
    console.log(`Inserted ${result.insertedCount} currencies`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
