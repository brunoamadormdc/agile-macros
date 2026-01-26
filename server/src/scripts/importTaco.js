const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const FoodItem = require("../models/FoodItem");
const env = require("../config/env");

// Assuming the taco file exports an array named 'taco_table'
// Since it uses 'export const', we need to handle it.
// Node.js commonjs doesn't support 'export const' directly without module type.
// We will read the file manually and eval/parse it or use a transform.
// Or simpler: We can just require it if we modify it to be commonjs,
// OR we can read the file content, strip 'export const taco_table =', and JSON.parse if it's valid JSON array structure.

// Looking at the file content:
// export const taco_table = [ ... ]
// This is not valid JSON because of the keys not being quoted?
// Wait, the keys ARE quoted in the preview: "id": "...", "nome_do_alimento": "..."
// So the array content is valid JSON.

async function importData() {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB");

    const tacoPath = path.join(__dirname, "../../../tabela_taco.js");
    console.log(`Reading file from ${tacoPath}...`);

    let fileContent = fs.readFileSync(tacoPath, "utf8");

    // Strip the export statement to get just the array
    const start = fileContent.indexOf("[");
    const end = fileContent.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Could not find array in file");
    }

    // We need to be careful. If the file is huge, JSON.parse might be heavy.
    // Also, is it valid JSON? Keys are quoted. Values are quoted numbers.
    // It should be parseable.

    const jsonString = fileContent.substring(start, end + 1);

    // There might be trailing commas, which JSON.parse dislikes.
    // But let's try parsing first.
    let tacoData;
    try {
      tacoData = JSON.parse(jsonString);
    } catch (e) {
      console.log("JSON parse failed, trying safe eval...");
      // If it's valid JS object literal array, eval might work (though unsafe, this is a trusted local script)
      tacoData = eval(jsonString);
    }

    if (!Array.isArray(tacoData)) {
      throw new Error("Data is not an array");
    }

    console.log(`Found ${tacoData.length} items to process.`);

    // Prepare operations for bulkWrite
    const operations = tacoData.map((item) => {
      // Transform fields
      // "nome_do_alimento" -> name
      // "calorias" -> calories
      // "proteinas" -> protein
      // "carboidratos" -> carbs
      // "gorduras" -> fat
      // All values are strings in source, need minimal parsing.

      return {
        updateOne: {
          filter: { name: item.nome_do_alimento.trim() },
          update: {
            $set: {
              name: item.nome_do_alimento.trim(),
              calories: parseFloat(item.calorias) || 0,
              protein: parseFloat(item.proteinas) || 0,
              carbs: parseFloat(item.carboidratos) || 0,
              fat: parseFloat(item.gorduras) || 0,
              portion: 100, // TACO is usually per 100g
              source: "TACO",
            },
          },
          upsert: true,
        },
      };
    });

    console.log("Starting bulk write...");
    // Split into chunks of 1000 to avoid memory issues or request size limits
    const chunkSize = 1000;
    for (let i = 0; i < operations.length; i += chunkSize) {
      const chunk = operations.slice(i, i + chunkSize);
      await FoodItem.bulkWrite(chunk);
      console.log(
        `Processed ${Math.min(i + chunkSize, operations.length)} / ${operations.length}`,
      );
    }

    console.log("Import completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err);
    process.exit(1);
  }
}

importData();
