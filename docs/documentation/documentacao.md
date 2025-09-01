---
title: Documentação
category: documentation
hidden: true
link:
  new_tab: false
---
# 📊 Monitoramento de Notas Fiscais — Google Apps Script

Este projeto automatiza o **controle de emissão de notas fiscais** utilizando **Google Apps Script** integrado ao Google Sheets.
Ele verifica a planilha **"Contratos 2025"**, identifica atrasos e envia **alertas automáticos por e-mail** para responsáveis e setores internos.

***

## ⚙️ Funcionalidades  7

* 🔄 Executa automaticamente em dias úteis específicos (**Segunda, Quarta e Sexta**).
* 📑 Lê dados da planilha `Contratos 2025`. 
* 🟨 Destaca em **amarelo** células de notas fiscais em atraso.
* 📩 Envia **relatórios por e-mail**:
  * **Pendências**: lista de notas em atraso com tabela detalhada.
  * **Status OK**: confirma que não há pendências de emissão.

***

## 🗂 Estrutura do Código

* `atrasosNF()` → Função principal que realiza as verificações e envia relatórios.
* `tentarConverterParaData()` → Função auxiliar para validar e converter datas em diferentes formatos.

***

## 📋 Pré-requisitos

1. Conta Google com acesso ao **Google Sheets** e **Google Apps Script**.
2. Planilha chamada **"Contratos 2025"** configurada com as seguintes colunas:
   * Coluna D → Número do fornecedor
   * Coluna F → Contato (e-mail da empresa)
   * Coluna G → Nome da empresa
   * Coluna H → Serviço
   * Coluna BB → Nota do mês atual - Variável conforme o mês
   * Coluna BC → Data de emissão do mês atual - Variável conforme o mês

***

## 🚀 Como usar

1. Abra o Google Sheets e acesse:
   **Extensões > Apps Script**.
2. Copie o código para o editor.
3. Ajuste as variáveis de configuração:
   * Nome da planilha
   * Colunas de referência
   * Lista de destinatários de e-mail
4. Salve e configure um **gatilho de tempo (Time-driven trigger)**:
   * Executar em **Segunda, Quarta e Sexta** (ou conforme necessidade).
5. O script passará a rodar automaticamente e enviar relatórios por e-mail.

***

## 📧 Exemplo de Relatório

### Caso haja pendências:

* Linha
* Empresa
* Serviço
* Fornecedor
* Data esperada de emissão

### Caso esteja tudo em dia:

* Mensagem confirmando que **todas as notas foram emitidas** até a data atual.

***

## 🛠 Tecnologias

* **Google Apps Script (JavaScript-like)**
* **Google Sheets API**
* **GmailApp Service**

***

## 📌 Observações

* O envio de e-mail direto para fornecedores está **comentado** no código, podendo ser ativado no futuro (esperando apenas e-mail corretos dos fornecedores)
* A quantidade de linhas (`ultimaLinha`) deve ser ajustada conforme a planilha crescer.
* As variáveis **COLUNA_NOTA** e **COLUNA_EMISSAO** devem ser trocadas todo início de mês, contado pelo número de colunas.

***

## 👨‍💻 Autor

Desenvolvido por **João Paulo Figueiredo Serafim**
📧 [[joao.serafim@cobrarolamentos.com.br](mailto:joao.serafim@cobrarolamentos.com.br)]