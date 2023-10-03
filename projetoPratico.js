function dijkstra(grafo, noInicial, noFinal, criterio, horarioPartida) {
    const distancias = {};
    const visitados = {};
    const anteriores = {};
    const filaPrioridade = new FilaPrioridade();
  
    // Inicializa as distâncias com infinito e marca todos os nós como não visitados
    for (let no in grafo) {
      distancias[no] = Infinity;
      visitados[no] = false;
      anteriores[no] = null;
    }
  
    // A distância do nó de partida para ele mesmo é 0
    distancias[noInicial] = 0;
  
    // Adiciona o nó de partida à fila de prioridade com uma prioridade de 0
    filaPrioridade.inserir(noInicial, 0);
  
    while (!filaPrioridade.isEmpty()) {
      const noAtual = filaPrioridade.remover().elemento;
  
      // Se o nó já foi visitado pula
      if (visitados[noAtual]) continue;
  
      // Marca o nó como visitado
      visitados[noAtual] = true;
  
      for (let vizinho of Object.keys(grafo[noAtual])) {
        for (let conexao of grafo[noAtual][vizinho]) {
          const distanciaTotal = distancias[noAtual] + (criterio === 'tempo' ? conexao.tempo : conexao.custo);
          const horarioPartidaConexao = conexao.horarioPartida;
  
          // Verifica se o horário de partida da conexão está no formato correto
          if (!isHorarioValido(horarioPartidaConexao)) {
            console.log(`Horário inadequado: ${horarioPartidaConexao}`);
            continue; // Ignora horários inválidos
          }
  
          // Verifica se o horário de partida da conexão é após o horário de partida especificado
          if (horarioPartidaConexao > horarioPartida) {
            // Se a distância total for menor do que a distância atual atualiza
            if (distanciaTotal < distancias[vizinho]) {
              distancias[vizinho] = distanciaTotal;
              anteriores[vizinho] = noAtual;
              // Adiciona o vizinho à fila de prioridade com a nova prioridade
              filaPrioridade.inserir(vizinho, distanciaTotal);
            }
          }
        }
      }
    }
  
    // Constrói o caminho a partir do nó de destino
    let caminho = [];
    let noAtual = noFinal;
    while (noAtual !== null) {
      caminho.unshift(noAtual);
      noAtual = anteriores[noAtual];
    }
  
    return { distancia: distancias[noFinal], caminho };
  }
  
  class FilaPrioridade {
    constructor() {
      this.fila = [];
    }
  
    inserir(elemento, prioridade) {
      const item = { elemento, prioridade };
      let adicionado = false;
  
      for (let i = 0; i < this.fila.length; i++) {
        if (item.prioridade < this.fila[i].prioridade) {
          this.fila.splice(i, 0, item);
          adicionado = true;
          break;
        }
      }
  
      if (!adicionado) {
        this.fila.push(item);
      }
    }
  
    remover() {
      if (!this.isEmpty()) {
        return this.fila.shift();
      }
      return null;
    }
  
    isEmpty() {
      return this.fila.length === 0;
    }
  }
  
  function encontrarRotasComConexoes(grafo, cidadeInicial, cidadeFinal, criterio, horarioPartida) {
    const rotas = [];
  
    function encontrarRotas(cidadeAtual, rotaAtual, horarioAtual, visitados) {
        if (cidadeAtual === cidadeFinal) {
          rotas.push(rotaAtual);
          return;
        }
      
        visitados[cidadeAtual] = true; // Marca a cidade atual como visitada
      
        for (let vizinho in grafo[cidadeAtual]) {
          for (let conexao of grafo[cidadeAtual][vizinho]) {
            const horarioPartidaConexao = conexao.horarioPartida;
      
            // Verifica se o horário de partida da conexão está no formato correto
            if (!isHorarioValido(horarioPartidaConexao)) {
              console.log(`Horário inadequado: ${horarioPartidaConexao}`);
              continue; // Ignora horários inválidos
            }
      
            // Verifica se o horário de partida da conexão é após o horário atual
            if (horarioPartidaConexao >= horarioAtual && !visitados[vizinho]) {
              const proximaCidade = vizinho;
              const proximoHorario = horarioPartidaConexao;
              encontrarRotas(
                proximaCidade,
                [...rotaAtual, { cidade: proximaCidade, conexao }],
                proximoHorario,
                { ...visitados } // Passa uma cópia do objeto visitados para evitar efeitos colaterais
              );
            }
          }
        }
      }
      
      const visitados = {}; // Inicie o objeto de visitados vazio
      
      encontrarRotas(cidadeInicial, [], horarioPartida, visitados);
  
    return rotas;
  }
  
  function isHorarioValido(horario) {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;
  }
  
  const grafo = {
    'Aracaju': {
      'São Cristóvão': [
        { destino: 'São Cristóvão', tempo: 30, horarioPartida: '06:00' },
        { destino: 'São Cristóvão', tempo: 45, horarioPartida: '06:30' },
        { destino: 'São Cristóvão', tempo: 45, horarioPartida: '08:45' },
        { destino: 'São Cristóvão', tempo: 40, horarioPartida: '07:30' },
        { destino: 'São Cristóvão', tempo: 35, horarioPartida: '09:45' },
        { destino: 'São Cristóvão', tempo: 37, horarioPartida: '11:00' },
        { destino: 'São Cristóvão', tempo: 38, horarioPartida: '14:15' }
      ],
      'Nossa Senhora do Socorro': [
        { destino: 'Nossa Senhora do Socorro', tempo: 45, horarioPartida: '06:00' },
        { destino: 'Nossa Senhora do Socorro', tempo: 60, horarioPartida: '00:45' },
        { destino: 'Nossa Senhora do Socorro', tempo: 45, horarioPartida: '06:30' },
        { destino: 'Nossa Senhora do Socorro', tempo: 30, horarioPartida: '08:00' },
        { destino: 'Nossa Senhora do Socorro', tempo: 55, horarioPartida: '09:45' },
        { destino: 'Nossa Senhora do Socorro', tempo: 58, horarioPartida: '12:15' },
        { destino: 'Nossa Senhora do Socorro', tempo: 51, horarioPartida: '14:30' }
      ],
    },
    'São Cristóvão': {
      'Aracaju': [
        { destino: 'Aracaju', tempo: 30, horarioPartida: '10:31' },
        { destino: 'Aracaju', tempo: 25, horarioPartida: '11:15' },
        { destino: 'Aracaju', tempo: 30, horarioPartida: '15:00' },
        { destino: 'Aracaju', tempo: 32, horarioPartida: '16:30' },
        { destino: 'Aracaju', tempo: 33, horarioPartida: '17:45' },
        { destino: 'Aracaju', tempo: 35, horarioPartida: '19:00' },
        { destino: 'Aracaju', tempo: 28, horarioPartida: '21:15' }
      ],
      'Nossa Senhora do Socorro': [
        { destino: 'Nossa Senhora do Socorro', tempo: 20, horarioPartida: '07:00' },
        { destino: 'Nossa Senhora do Socorro', tempo: 30, horarioPartida: '06:00' },
        { destino: 'Nossa Senhora do Socorro', tempo: 45, horarioPartida: '06:30' },
        { destino: 'Nossa Senhora do Socorro', tempo: 60, horarioPartida: '08:00' },
        { destino: 'Nossa Senhora do Socorro', tempo: 10, horarioPartida: '08:00' },
        { destino: 'Nossa Senhora do Socorro', tempo: 18, horarioPartida: '09:30' },
        { destino: 'Nossa Senhora do Socorro', tempo: 27, horarioPartida: '10:45' }
      ],
    },
    'Nossa Senhora do Socorro': {
      'Aracaju': [
        { destino: 'Aracaju', tempo: 90, horarioPartida: '06:00' },
        { destino: 'Aracaju', tempo: 30, horarioPartida: '06:00' },
        { destino: 'Aracaju', tempo: 45, horarioPartida: '06:30' },
        { destino: 'Aracaju', tempo: 60, horarioPartida: '08:30' },
        { destino: 'Aracaju', tempo: 58, horarioPartida: '09:45' },
        { destino: 'Aracaju', tempo: 70, horarioPartida: '11:00' },
        { destino: 'Aracaju', tempo: 65, horarioPartida: '14:15' }
      ],
      'São Cristóvão': [
        { destino: 'São Cristóvão', tempo: 120, horarioPartida: '09:00' },
        { destino: 'São Cristóvão', tempo: 30, horarioPartida: '06:00' },
        { destino: 'São Cristóvão', tempo: 45, horarioPartida: '06:30' },
        { destino: 'São Cristóvão', tempo: 45, horarioPartida: '06:45' },
        { destino: 'São Cristóvão', tempo: 55, horarioPartida: '08:00' },
        { destino: 'São Cristóvão', tempo: 48, horarioPartida: '09:30' },
        { destino: 'São Cristóvão', tempo: 42, horarioPartida: '15:45' }
      ],
    },
  };
  

  
  // Função para verificar se o horário está no formato HH:MM
  function isHorarioValido(horario) {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;
  }
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Função para solicitar a entrada do usuário
  function solicitarEntrada(prompt, callback) {
    rl.question(prompt, (resposta) => {
      callback(resposta);
    });
  }
  
  // Função para verificar se o horário está no formato HH:MM
  function isHorarioValido(horario) {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;
  }
  
  // Função principal que inicia o programa
  (function iniciarPrograma() {
    solicitarEntrada('Escolha a cidade de partida (1 - Aracaju, 2 - São Cristóvão, 3 - Nossa Senhora do Socorro): ', (cidadeInicialEscolhida) => {
      let cidadeInicial;
  
      switch (cidadeInicialEscolhida) {
        case '1':
          cidadeInicial = 'Aracaju';
          break;
        case '2':
          cidadeInicial = 'São Cristóvão';
          break;
        case '3':
          cidadeInicial = 'Nossa Senhora do Socorro';
          break;
        default:
          console.log('Opção inválida.');
          rl.close();
          return;
      }
  
      solicitarEntrada('Escolha a cidade de destino (1 - Aracaju, 2 - São Cristóvão, 3 - Nossa Senhora do Socorro): ', (cidadeFinalEscolhida) => {
        let cidadeFinal;
  
        switch (cidadeFinalEscolhida) {
          case '1':
            cidadeFinal = 'Aracaju';
            break;
          case '2':
            cidadeFinal = 'São Cristóvão';
            break;
          case '3':
            cidadeFinal = 'Nossa Senhora do Socorro';
            break;
          default:
            console.log('Opção inválida.');
            rl.close();
            return;
        }
        if (cidadeInicial === cidadeFinal) {
            console.log('A cidade de partida e a cidade de destino não podem ser iguais.');
            rl.close();
            return;
          }
        const criterio = 'tempo';
  
        solicitarEntrada('Digite o horário de partida (no formato HH:MM): ', (horarioPartidaEscolhido) => {
          // Verifica se o horário de partida está no formato correto
          if (!isHorarioValido(horarioPartidaEscolhido)) {
            console.log('Horário de partida inválido.');
            rl.close();
            return;
          }
  
          const horarioPartida = horarioPartidaEscolhido;
  
          // Agora você pode chamar a função encontrarRotasComConexoes com os valores escolhidos
          const rotas = encontrarRotasComConexoes(grafo, cidadeInicial, cidadeFinal, criterio, horarioPartida);
  
          if (rotas.length > 0) {
            console.log(`Rotas possíveis de ${cidadeInicial} para ${cidadeFinal} (${criterio}) com saída às ${horarioPartida}:`);
            rotas.forEach((rota, indice) => {
              const tempoTotal = rota.reduce((total, passo) => total + (criterio === 'tempo' ? passo.conexao.tempo : passo.conexao.custo), 0);
              let rotaValida = true;
          
              for (let i = 0; i < rota.length - 1; i++) {
                const passoAtual = rota[i].conexao;
                const proximoPasso = rota[i + 1].conexao;
          
                const [horaAtual, minutoAtual] = passoAtual.horarioPartida.split(':').map(Number);
                const [proximaHora, proximoMinuto] = proximoPasso.horarioPartida.split(':').map(Number);
          
                const minutosTotaisAtual = horaAtual * 60 + minutoAtual;
                const minutosTotaisProximo = proximaHora * 60 + proximoMinuto;
          
                if (minutosTotaisAtual + passoAtual.tempo > minutosTotaisProximo) {
                  rotaValida = false;
                  break;
                }
              }
          
              // Verifica se o último passo da rota é válido
              if (rotaValida) {
                const ultimoPasso = rota[rota.length - 1].conexao;
                if (ultimoPasso.destino !== cidadeFinal) {
                  rotaValida = false;
                }
              }
          
              if (rotaValida) {
                console.log(`Rota ${indice + 1}:`);
                console.log('Passos:');
                let minutosTotais = 0; // Inicializa o tempo total em minutos
                let horarioPartidaAnterior = rota[0].conexao.horarioPartida; // Usa o horário de partida do primeiro passo como referência
          
                rota.forEach((passo, indicePasso) => {
                  const cidadeOrigem = indicePasso === 0 ? cidadeInicial : rota[indicePasso - 1].conexao.destino;
                  const cidadeDestino = passo.conexao.destino;
          
                  // Calcula o tempo de viagem para o passo atual em minutos
                  const tempoViagem = passo.conexao.tempo;
          
                  // Ignora o tempo de viagem do primeiro passo
                  const tempoEntrePassos = indicePasso === 0 ? 0 : tempoViagem;
          
                  // Calcula o horário de partida do passo atual
                  const horarioPartidaAtual = passo.conexao.horarioPartida;
          
                  // Soma o tempo entre os passos e o tempo de viagem do passo atual ao tempo total
                  minutosTotais += tempoEntrePassos + calcularMinutosTotais(horarioPartidaAnterior, horarioPartidaAtual);
          
                  console.log(`${indicePasso + 1}. De ${cidadeOrigem} para ${cidadeDestino}`);
                  console.log(`   Horário de partida: ${horarioPartidaAtual}`);
                  console.log(`   Tempo: ${tempoViagem} minutos`);
          
                  // Atualiza o horário de partida para o próximo passo
                  horarioPartidaAnterior = horarioPartidaAtual;
                });
          
                // Se houver apenas um passo na rota, exibe o tempo de viagem como tempo total
                if (rota.length === 1) {
                  const tempoViagemUnicoPasso = rota[0].conexao.tempo;
                  minutosTotais = tempoViagemUnicoPasso;
                }
          
                // Calcula o tempo total no formato "hh:mm"
                const horasTotais = Math.floor(minutosTotais / 60);
                const minutosRestantes = minutosTotais % 60;
                console.log(`Tempo total: ${horasTotais}h ${minutosRestantes}min`);
              }
            });
          } else {
            console.log(`Não há rotas de ${cidadeInicial} para ${cidadeFinal} com saída às ${horarioPartida}`);
          }
  
          rl.close();
        });
      });
    });
  })();
  
  
  
  function calcularMinutosTotais(horarioPartida, horarioChegada) {
    const [horaPartida, minutoPartida] = horarioPartida.split(':').map(Number);
  
    let horaChegada = 0;
    let minutoChegada = 0;
  
    if (horarioChegada && typeof horarioChegada === 'string') {
      [horaChegada, minutoChegada] = horarioChegada.split(':').map(Number);
    }
  
    return (horaChegada - horaPartida) * 60 + (minutoChegada - minutoPartida);
  }
  