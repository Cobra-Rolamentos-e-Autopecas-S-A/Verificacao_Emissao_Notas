const fs = require('fs');
const fetch = require('node-fetch');

// Lê o Markdown gerado
const md = fs.readFileSync('docs/documentacao_auto.md', 'utf-8');

// Configurações do ReadMe.io
const API_KEY = 'SUA_API_KEY';           // Coloque aqui sua API Key
const DOC_ID = 'ID_DO_DOC';              // Coloque aqui o ID do documento no ReadMe.io

async function updateReadMe() {
  try {
    const res = await fetch(`https://dash.readme.com/api/v1/docs/${DOC_ID}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: md })
    });

    const data = await res.json();
    console.log('Documento atualizado com sucesso:', data.title);
  } catch (err) {
    console.error('Erro ao atualizar documento:', err);
  }
}

updateReadMe();
