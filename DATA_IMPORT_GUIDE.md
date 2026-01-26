# Guia de Importação de Dados - Tabela TACO

Este projeto utiliza a **Tabela Brasileira de Composição de Alimentos (TACO)** como base de dados inicial para busca de informações nutricionais.

Para quem baixou o projeto do GitHub ou está configurando um novo ambiente, é necessário rodar o script de importação para popular o banco de dados MongoDB com os cerca de **14.000 itens** disponíveis.

---

## 📋 Pré-requisitos

1.  **Node.js 18+** instalado.
2.  **MongoDB** rodando localmente ou uma URI de conexão válida.
3.  As dependências do servidor instaladas (`cd server && npm install`).
4.  Arquivo `.env` configurado na pasta `server` com a variável `MONGODB_URI`.

---

## 🚀 Como Importar os Dados

Siga os passos abaixo para rodar o script de importação:

### Passo 1: Acesse a pasta do servidor

Abra seu terminal e navegue até o diretório `server`:

```bash
cd server
```

### Passo 2: Verifique a configuração do banco

Certifique-se de que o arquivo `.env` na pasta `server` contém a string de conexão correta, por exemplo:

```env
MONGODB_URI=mongodb://localhost:27017/app_counter
```

### Passo 3: Execute o comando de importação

Rode o seguinte comando npm, que foi configurado para executar o script `src/scripts/importTaco.js`:

```bash
npm run import-taco
```

### Passo 4: Aguarde a conclusão

O script irá ler o arquivo `tabela_taco.js` localizado na raiz do projeto (monorepo), processar os itens e inseri-los no MongoDB.

Você verá logs de progresso no terminal:

```
Connecting to MongoDB...
Connected to MongoDB
Reading file from .../tabela_taco.js...
Found 13958 items to process.
Starting bulk write...
Processed 1000 / 13958
Processed 2000 / 13958
...
Import completed successfully!
```

---

## ⚠️ Solução de Problemas

- **Erro de Conexão:** Se o script falhar ao conectar ("MongoNetworkError"), verifique se o MongoDB está rodando (`docker ps` ou `systemctl status mongod`) e se a URI no `.env` está correta.
- **Arquivo não encontrado:** O script espera encontrar o arquivo `tabela_taco.js` na raiz do projeto (dois níveis acima da pasta do script). Se você moveu arquivos, pode precisar ajustar o caminho.
- **Duplicidade:** O script utiliza operação `upsert` baseada no **nome** do alimento. Se você rodar o script duas vezes, ele atualizará os itens existentes em vez de duplicá-los.

---

**Pronto!** Agora seu aplicativo já deve conseguir buscar alimentos como "Arroz", "Feijão" e "Frango" na barra de busca.
