# Loja Virtual de Jogos — Arquitetura Client-Server

## 1. Sobre o Projeto

O projeto consiste no desenvolvimento de uma loja virtual de jogos, utilizando o estilo arquitetural **Client-Server (Cliente-Servidor)**. A aplicação permite consultar os jogos disponíveis, visualizar informações dos produtos, adicionar itens ao carrinho, modificar quantidades, remover produtos e finalizar compras. O sistema é dividido em duas partes principais: o cliente, responsável pela interface e pelas solicitações realizadas pelo usuário, e o servidor, responsável pelo processamento das informações, gerenciamento dos dados e retorno das respostas. A comunicação entre essas partes acontece por meio de uma API REST, utilizando requisições HTTP e transferência de informações no formato JSON.

## 2. Arquitetura Client-Server

O estilo arquitetural Client-Server organiza a aplicação em dois componentes principais, cada um com responsabilidades específicas.

### Cliente (Client)

O cliente representa a interface utilizada pelo usuário para interagir com a loja virtual. Desenvolvido com HTML, CSS e JavaScript, é responsável por apresentar os jogos disponíveis, exibir o carrinho e permitir a realização das operações. Também realiza as solicitações ao servidor, recebe as respostas e atualiza as informações apresentadas na página.

### Servidor (Server)

O servidor é responsável por receber e processar as solicitações enviadas pelo cliente. Desenvolvido com Node.js e Express, controla as operações da aplicação, consulta e atualiza os dados e retorna as respostas correspondentes. Entre suas responsabilidades estão o gerenciamento dos jogos, o controle dos carrinhos, a verificação do estoque e o registro dos pedidos.

### Comunicação entre Cliente e Servidor

A comunicação acontece por meio de requisições HTTP, utilizando uma API REST. Quando o usuário acessa a loja, o cliente solicita ao servidor a lista de jogos disponíveis. O servidor consulta os dados armazenados e retorna as informações para serem apresentadas na interface. O mesmo processo acontece nas operações do carrinho e na finalização das compras. Cada solicitação é recebida, processada e respondida pelo servidor, mantendo a separação entre a interface e o gerenciamento das informações.

## 3. Tecnologias Utilizadas

- **HTML:** estrutura da interface da loja.
- **CSS:** apresentação visual e organização dos elementos.
- **JavaScript:** funcionalidades do cliente e comunicação com o servidor.
- **Node.js:** ambiente utilizado para executar o servidor.
- **Express:** gerenciamento das rotas e operações da API REST.
- **CORS:** permite a comunicação entre aplicações de diferentes origens.
- **JSON:** armazenamento e transferência das informações.
- **Git e GitHub:** controle de versões e gerenciamento do repositório.

## 4. Estrutura do Projeto

O projeto está organizado em arquivos que representam as diferentes responsabilidades da aplicação.

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Interface da loja e funcionalidades do cliente. |
| `server.js` | Servidor, processamento das operações e rotas da API. |
| `dados.json` | Armazenamento dos jogos, carrinhos e pedidos. |
| `package.json` | Configurações e dependências do projeto. |
| `package-lock.json` | Registro das versões das dependências instaladas. |
| `README.md` | Documentação e descrição do projeto. |

### Organização do Cliente

O cliente apresenta o catálogo de jogos e disponibiliza as funcionalidades para interação com a loja. É responsável por consultar os produtos, adicionar itens ao carrinho, alterar quantidades, remover jogos e solicitar a finalização das compras. Também apresenta os resultados das operações realizadas pelo servidor, mantendo as informações da interface atualizadas.

### Organização do Servidor

O servidor concentra as regras e o processamento das operações da aplicação. Recebe as solicitações do cliente, verifica os dados enviados, realiza as alterações necessárias e retorna respostas de acordo com o resultado de cada operação.

### Armazenamento de Dados

As informações são armazenadas em um arquivo JSON, que mantém os dados dos jogos, os carrinhos dos usuários e os pedidos realizados. O servidor é responsável por consultar e atualizar essas informações, permitindo que os dados permaneçam disponíveis mesmo após o encerramento da aplicação.

## 5. Funcionalidades do Sistema

### Catálogo de Jogos

Permite consultar os jogos disponíveis na loja, apresentando informações como título, categoria, preço e quantidade em estoque. Os dados são obtidos por meio de uma solicitação ao servidor, que consulta as informações armazenadas e retorna os resultados ao cliente. Também é possível consultar individualmente um jogo por meio de seu identificador.

### Gerenciamento do Carrinho

Permite adicionar jogos ao carrinho, consultar os produtos selecionados, modificar quantidades e remover itens individualmente. O sistema também calcula o valor total dos produtos adicionados, permitindo acompanhar o custo da compra antes de finalizá-la. Os carrinhos são organizados por identificador de usuário, mantendo os produtos associados a cada usuário.

### Controle de Estoque

O servidor verifica a disponibilidade dos jogos antes de permitir determinadas operações. Essa validação impede que sejam adicionadas quantidades superiores ao estoque disponível e também acontece durante a finalização da compra. Após a confirmação do pedido, as quantidades dos produtos são atualizadas de acordo com os itens adquiridos.

### Finalização de Compras

Permite concluir uma compra utilizando os produtos presentes no carrinho. Durante o processo, o servidor verifica se existem itens selecionados, confere se os jogos estão cadastrados e verifica se há estoque suficiente. Após as verificações, o pedido é registrado, o estoque é atualizado e o carrinho é limpo. Os pedidos armazenam informações sobre o usuário relacionado, os produtos adquiridos e a data da compra.

## 6. API REST e Rotas

A aplicação utiliza uma API REST para realizar a comunicação entre cliente e servidor. Cada operação utiliza um método HTTP de acordo com sua finalidade.

| Método HTTP | Endpoint | Descrição |
|---|---|---|
| GET | `/api/jogos` | Consulta todos os jogos disponíveis. |
| GET | `/api/jogos/:id` | Consulta um jogo específico. |
| POST | `/api/carrinho` | Adiciona um jogo ao carrinho. |
| GET | `/api/carrinho/:usuarioId` | Consulta o carrinho de um usuário. |
| PATCH | `/api/carrinho/item` | Modifica a quantidade de um item. |
| DELETE | `/api/carrinho/:usuarioId/:jogoId` | Remove um jogo do carrinho. |
| POST | `/api/checkout` | Finaliza uma compra. |

### Respostas HTTP

O servidor utiliza códigos de status HTTP para indicar o resultado das solicitações.

| Código | Significado | Utilização |
|---|---|---|
| 200 | OK | Operação realizada com sucesso. |
| 201 | Created | Pedido criado com sucesso. |
| 400 | Bad Request | Solicitação inválida ou operação não permitida. |
| 404 | Not Found | Informação ou recurso não encontrado. |

Essas respostas permitem que o cliente identifique o resultado de cada operação e apresente as informações correspondentes ao usuário.

## 7. Requisitos do Sistema

### Requisitos Funcionais

Os requisitos funcionais representam as operações disponibilizadas pelo sistema.

| Requisito | Descrição |
|---|---|
| Cadastro de clientes | Permitir o cadastro de novos usuários. |
| Cadastro de jogos | Permitir cadastrar novos jogos. |
| Consulta de jogos | Permitir visualizar os jogos disponíveis. |
| Carrinho de compras | Permitir adicionar jogos ao carrinho. |
| Compra de jogos | Permitir finalizar pedidos. |
| Formas de pagamento | Disponibilizar opções de pagamento. |
| Controle de estoque | Verificar e atualizar a quantidade dos jogos. |
| Comprovante de compras | Disponibilizar um comprovante após a compra. |
| Histórico de compras | Permitir consultar os pedidos anteriores. |

Atualmente, o sistema contempla a consulta de jogos, o gerenciamento do carrinho, o controle de estoque e a finalização de compras. O cadastro de clientes e jogos, as formas de pagamento e a emissão de comprovantes não fazem parte das funcionalidades implementadas. Os pedidos são registrados no armazenamento, mas ainda não existe uma funcionalidade completa para consultar o histórico de compras pela interface.

### Requisitos Não Funcionais

Os requisitos não funcionais representam as condições de funcionamento e qualidade esperadas para o sistema.

| Requisito | Descrição |
|---|---|
| Segurança dos dados | Proteger as informações dos clientes. |
| Segurança de pagamentos | Garantir a proteção das informações financeiras. |
| Controle de acesso | Permitir acesso somente a usuários autorizados. |
| Acesso simultâneo | Suportar diferentes usuários utilizando o sistema. |
| Tempo de resposta | Retornar informações em tempo adequado. |

A aplicação possui uma estrutura básica para demonstrar a arquitetura escolhida. Entretanto, mecanismos de autenticação, proteção de dados e segurança de pagamentos não estão implementados, sendo necessários para uma utilização comercial.

## 8. Diagramas Arquiteturais

### Diagrama de Pacotes

Representa a organização das partes do projeto, demonstrando a separação entre cliente, servidor e armazenamento de dados. Permite identificar como as responsabilidades estão distribuídas e organizadas dentro da aplicação.

### Diagrama de Componentes

Apresenta os principais componentes do sistema e suas relações, demonstrando a comunicação entre a interface do cliente, a API REST, o processamento das operações e o armazenamento das informações.

### Diagrama de Implantação

Representa os ambientes nos quais os componentes da aplicação são executados, identificando o navegador utilizado pelo cliente, o servidor Node.js e o armazenamento dos dados. Também demonstra as conexões de comunicação entre esses elementos.

## 9. Execução do Projeto

Para executar a aplicação, é necessário ter o Node.js instalado no computador. Primeiramente, deve-se obter o repositório e abrir a pasta do projeto no ambiente de desenvolvimento. Em seguida, é necessário instalar as dependências utilizadas pelo servidor e iniciar a aplicação pelo terminal. Com o servidor em execução, o arquivo principal da interface poderá ser aberto no navegador, permitindo utilizar as funcionalidades da loja. O servidor deve permanecer ativo durante a utilização do sistema, pois é responsável por receber e processar as solicitações realizadas pelo cliente.

## 10. Integrantes

O desenvolvimento foi organizado entre cinco integrantes, com responsabilidades distribuídas entre documentação, requisitos, diagramas, implementação e testes.

| Integrante | Responsabilidade |
|---|---|
| Angelo | Documentação e organização dos slides. |
| Bianca | Levantamento dos requisitos funcionais e não funcionais. |
| Daniel | Desenvolvimento dos diagramas arquiteturais. |
| Saulo | Estruturação e implementação inicial dos códigos. |
| Davi | Integração, acompanhamento e testes do sistema. |

Todos os integrantes participam do desenvolvimento e podem colaborar nas diferentes etapas do projeto, incluindo implementação, revisão e preparação da apresentação.
