const env = require("../config/env");

const SYSTEM_PROMPT = `
You are a Nutrition Coach AI. Your goal is to analyze the user's weekly nutrition data and provide a helpful, encouraging, and actionable summary.
The user will provide:
1. Weekly Targets (Calories, Protein, Carbs, Fat)
2. A list of daily logs for the past week (Monday to Sunday), each containing daily totals and a list of food names.

Your output must be a Markdown formatted response with the following sections:
## 📊 Análise Semanal
(A paragraph summarizing how the week went in terms of hitting targets. Be specific about days they missed or hit.)

## 🍎 Destaques da Alimentação
(Comments on food choices. Did they eat enough variety? Too much processed food? Praise good choices.)

## 🚀 Dicas para a Próxima Semana
(3 bullet points with specific, actionable advice to improve hitting their macros/calories next week.)

Keep the tone professional, encouraging, and concise. Language: Portuguese (Brazil).
`;

async function generateWeeklyAnalysis(weeklyData) {
  if (!env.openAiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Construct the user message from data
  // Expected weeklyData structure:
  // {
  //   targets: { kcal, protein, carbs, fat },
  //   days: [
  //     { date: "YYYY-MM-DD", totals: { kcal, ... }, foods: ["Egg", "Rice"] }
  //   ]
  // }
  
  const targetsStr = `METAS DA SEMANA:
- Calorias: ${weeklyData.targets.kcal} kcal
- Proteína: ${weeklyData.targets.protein} g
- Carboidratos: ${weeklyData.targets.carbs} g
- Gorduras: ${weeklyData.targets.fat} g`;
  
  let daysStr = "";
  for (const day of weeklyData.days) {
     const foodList = day.foods.join(", ");
     const macros = `Kcal: ${day.totals.kcal} | P: ${day.totals.protein}g | C: ${day.totals.carbs}g | G: ${day.totals.fat}g`;
     daysStr += `\n- [${day.weekday}]: Consumo: [${macros}]. Alimentos: ${foodList || "Nenhum"}`;
  }

  const prompt = `${targetsStr}\n\nDIÁRIO ALIMENTAR DA SEMANA:${daysStr}\n\nCom base nestes dados exatos (Metas vs Consumo Real), analise meu desempenho e sugira melhorias.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openAiModel || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error("No content received from AI");
  }

  return content;
}

module.exports = { generateWeeklyAnalysis };
