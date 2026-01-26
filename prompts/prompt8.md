Refine o MVP:

Backend:
- Validação robusta de date e payload (Zod) com mensagens claras
- Tratamento de erro padronizado { error: { message, details? } }
- Seed opcional: criar 2 presets padrões no start se não existir nada (para demo-user)

Frontend:
- Estados vazios bonitos: "Nenhum item hoje"
- Loading states
- Input numérico com step=0.1 quando fizer sentido
- Botão "Adicionar" desabilitado quando inválido
- Página /week com lista dos 7 dias e total da semana

Finalize com README atualizado e exemplos de uso (cURLs).
