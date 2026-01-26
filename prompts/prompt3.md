Crie uma base simples de alimentos para o MVP SEM LLM e sem depender de APIs externas.

Implemente:
- server/src/data/foodCatalog.js com uns 30 itens comuns (Brasil), cada item:
  { key, label, unitDefault, servingDefaultQty, kcal, protein_g, carbs_g, fat_g, aliases: [] }
Exemplos: arroz cozido, feijão, frango grelhado, ovo, pão francês, banana, leite, café, whey, carne moída, macarrão, azeite, queijo, etc.

Crie rota:
GET /api/foods/search?q=...
- Retorna lista rankeada por label/aliases (match simples contains)
- Limite 10 resultados

Crie lógica para "criar item a partir do catálogo":
- Se o usuário escolher um item do catálogo e informar qty, o backend calcula macros proporcionalmente:
  macros_final = macros_base * (qty / servingDefaultQty)

Crie testes leves (ou pelo menos uma doc no README) mostrando request/response.
