const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const FoodItem = require("../models/FoodItem");
const env = require("../config/env");

async function importTaco() {
  try {
    console.log("Connecting to database...");
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.mongoUri);
    console.log("Connected.");

    // Adjust path based on where we are.
    const tacoPath = path.resolve(__dirname, "../../../tabela_taco.js");
    console.log(`Loading data from ${tacoPath}...`);

    let content = fs.readFileSync(tacoPath, "utf8");

    // Remove the export declaration to make it valid JSON
    // "export const taco_table = [" ...
    content = content.replace("export const taco_table =", "").trim();
    // Remove trailing semicolon if present
    if (content.endsWith(";")) {
      content = content.slice(0, -1).trim();
    }

    let tacoData;
    try {
      tacoData = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse JSON. Attempting eval...");
      // If JSON parse fails (e.g. unquoted keys or comments), tried eval as fallback?
      // Although eval is dangerous, this is a local script.
      // Needs a sandbox or variable assignment.
      // Actually, let's just stick to JSON.parse first. If it fails, we see.
      console.error(e);
      process.exit(1);
    }

    console.log(`Found ${tacoData.length} items. Processing...`);

    const foodItems = tacoData.map((item) => {
      const parseVal = (val) => {
        if (typeof val === "string") {
          val = val.replace(",", ".");
        }
        return parseFloat(val) || 0;
      };

      return {
        name: item.nome_do_alimento.trim(),
        calories: parseVal(item.calorias),
        protein: parseVal(item.proteinas),
        carbs: parseVal(item.carboidratos),
        fat: parseVal(item.gorduras),
        portion: 100,
        source: "TACO",
      };
    });

    // Optional: clear existing TACO items to avoid duplicates
    console.log("Clearing existing TACO items...");
    await FoodItem.deleteMany({ source: "TACO" });

    console.log("Inserting items...");
    const batchSize = 1000;
    for (let i = 0; i < foodItems.length; i += batchSize) {
      const batch = foodItems.slice(i, i + batchSize);
      await FoodItem.insertMany(batch);
      console.log(
        `Inserted ${Math.min(i + batchSize, foodItems.length)} / ${foodItems.length}`,
      );
    }

    console.log("Import completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

importTaco();
