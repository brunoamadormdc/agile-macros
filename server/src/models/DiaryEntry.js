const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    qty: { type: Number, required: true },
    unit: { type: String, required: true },
    kcal: { type: Number, required: true },
    protein_g: { type: Number, required: true },
    carbs_g: { type: Number, required: true },
    fat_g: { type: Number, required: true },
    source: { type: String, enum: ['manual', 'preset', 'catalog', 'ai'], required: true },
  },
  { _id: false }
);

const TotalsSchema = new mongoose.Schema(
  {
    kcal: { type: Number, required: true, default: 0 },
    protein_g: { type: Number, required: true, default: 0 },
    carbs_g: { type: Number, required: true, default: 0 },
    fat_g: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const DiaryEntrySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    items: { type: [ItemSchema], default: [] },
    totals: { type: TotalsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

DiaryEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);
