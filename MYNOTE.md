📄 DOCUMENTO DE ARQUITETURA E DECISÕES
🎯 Visão Geral do Sistema

Este projeto foi desenvolvido com o objetivo de criar um pipeline de ingestão de mensagens WhatsApp (ChatGuru) com foco em:

alta performance

resiliência

escalabilidade

desacoplamento

A arquitetura foi pensada para lidar com:

grande volume de mensagens

falhas da API externa

necessidade de processamento contínuo

🧩 1. Bootstrap da aplicação (main.ts)
Por que esse arquivo existe?

É o ponto de entrada da aplicação. Responsável por iniciar o servidor e aplicar configurações globais.

O que ele resolve?

inicialização do sistema

aplicação de validação global

configuração de Swagger

controle de lifecycle

Decisões importantes

Uso de ValidationPipe global → garante que todos os dados sejam validados

enableShutdownHooks → prepara o sistema para produção (graceful shutdown)

Swagger ativado → melhora DX (developer experience)

🧩 2. AppModule (root module)
Por que esse arquivo existe?

Centraliza todos os módulos da aplicação.

O que ele resolve?

organiza a aplicação por domínios

conecta todas as partes do sistema

Decisão arquitetural

👉 Modularização

Cada domínio é isolado:

ingestão

integração externa

leitura

health

Isso permite evolução futura (ex: microservices)

🧩 3. Configuração de banco (database.config.ts + data-source.ts)
Por que existem?

Separar configuração de runtime e configuração de migrations.

O que resolvem?

conexão com PostgreSQL

controle de pool de conexões

gerenciamento de migrations

Decisões importantes

synchronize: false → evita corrupção de dados

uso de migrations → controle de versão do banco

validação de DATABASE_URL → fail fast

🧩 4. Entidades (Chat e Message)
Por que existem?

Representam o modelo de dados persistido.

O que resolvem?

estrutura do banco

relacionamento lógico dos dados

🧠 Message Entity (ponto crítico)
Decisões importantes:

externalId único → garante idempotência

chatId indexado → otimiza queries

timestamp vs createdAt:

timestamp = tempo do evento

createdAt = tempo de processamento

👉 isso é padrão de sistemas distribuídos

🧩 5. DTO (ChatguruMessageDto)
Por que existe?

Validar dados vindos da API externa.

O que resolve?

protege o sistema contra dados inválidos

define contrato de entrada

Decisão importante

👉 “Never trust external data”

🧩 6. Mapper (ChatguruMapper)
Por que existe?

Separar modelo externo do modelo interno.

O que resolve?

desacoplamento da API externa

normalização de dados

Decisão arquitetural

👉 Anti-Corruption Layer

Evita que mudanças externas afetem o sistema.

🧩 7. ChatguruAuth
Por que existe?

Centralizar autenticação da API externa.

O que resolve?

evita duplicação de headers

facilita manutenção

Decisão importante

uso de cookies + api key (API não oficial)

🧩 8. ChatguruService
Por que existe?

Isolar comunicação HTTP com a API externa.

O que resolve?

encapsula chamadas externas

trata falhas

Decisão importante

retorno de [] em caso de erro

👉 evita quebrar o pipeline

🧩 9. PollingJob
Por que existe?

Executar ingestão contínua.

O que resolve?

ausência de webhook

necessidade de atualização constante

Decisão arquitetural

loop infinito controlado

uso de await (evita concorrência descontrolada)

🧩 10. IngestionService
Por que existe?

Orquestrar o fluxo de ingestão.

O que resolve?

busca mensagens

valida

envia para fila

Decisões importantes

uso de Promise.allSettled
👉 evita que falha de 1 item quebre tudo

validação manual extra
👉 reforço de segurança

uso de jobId
👉 garante idempotência na fila

🧩 11. Queue (BullMQ)
Por que existe?

Desacoplar ingestão do processamento.

O que resolve?

processamento assíncrono

retry automático

escalabilidade

Decisões importantes

attempts: 3

backoff exponencial

👉 evita sobrecarga em falhas

🧩 12. Worker
Por que existe?

Processar mensagens da fila.

O que resolve?

persistência assíncrona

controle de concorrência

Decisões importantes

concurrency: 5
👉 balanceamento performance vs recursos

tratamento erro 23505
👉 idempotência no banco

🧩 13. MessagesModule (API)
Por que existe?

Expor dados armazenados.

O que resolve?

acesso às mensagens

leitura do sistema

Decisões importantes

separação controller/service
👉 Clean Architecture

🧩 14. MessagesService
Por que existe?

Centralizar lógica de leitura.

O que resolve?

queries otimizadas

Decisões importantes

take: 100
👉 evita queries pesadas

ordenação por timestamp
👉 uso real (chat)

🧩 15. HealthModule
Por que existe?

Monitoramento do sistema.

O que resolve?

integração com infra (k8s, load balancer)

Decisão importante

endpoint leve
👉 não depende de DB

🧩 16. Swagger
Por que existe?

Documentação da API.

O que resolve?

facilita testes

melhora integração frontend/backend

Decisão importante

desativado em produção
👉 segurança

🧩 17. Docker + Compose
Por que existem?

Padronizar ambiente.

O que resolvem?

consistência

facilidade de deploy

Decisões importantes

Redis separado → fila

Worker separado → escalabilidade

Postgres com volume → persistência

🧠 Arquitetura Geral
Tipo de sistema

👉 Pipeline de ingestão distribuído

Fluxo completo

Polling busca mensagens

Ingestion valida

Mapper normaliza

Queue recebe jobs

Worker processa

DB armazena

API expõe

🚀 Pilares aplicados

Resiliência

Idempotência

Escalabilidade

Separação de responsabilidades

Eventual consistency

💬 Frase final (para entrevista)

Este sistema foi projetado como um pipeline de ingestão resiliente e escalável, utilizando processamento assíncrono com filas, garantindo consistência eventual e proteção contra falhas externas.
