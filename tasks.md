Tarefas:
#1
Implementar um endpoint que permita obter os detalhes de uma poll (por ID).

#2
Implementar um endpoint que permita criar uma poll. Uma poll é constituida por uma pergunta e uma lista de opções.

#3
Implementar um endpoint que permita votar numa opção de uma poll.

#4
Existe um mecanismo de autenticação implementado. Este funciona com um login tradicional, que gera um token JWT. Com esta tarefa pretendemos limitar o acesso nas rotas "/polls" que não são GET, apenas a users autenticados.

#5
O nosso servidor não está a fazer log dos requests que recebe. Instala um middleware de loggging e adiciona-o na configuração do express.

#6
(depende da tarefa #1)
Altera a criação de polls para aceitar também uma data limite, após a qual não é possível votar.

#7
Pretendemos que a conta de um user fique bloqueada caso este falhe o login 3 vezes seguidas.
