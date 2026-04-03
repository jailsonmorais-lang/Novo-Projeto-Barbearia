const cortes = {
    classico: {
        nome: 'Corte Clássico',
        descricao: 'Corte tradicional com máquina e tesoura',
        preco: 35,
        tempo: '45 min',
        imagem: '/static/assets/ornaw-haircut-4019676_1280.webp'
    },

    barba: {
        nome: 'Barba & Bigode',
        descricao: 'Alinhamento completo com navalha',
        preco: 25,
        tempo: '30 min',
        imagem: '/static/assets/pexels-beard-1845166_1280.webp'
    },

    combo: {
        nome: 'Corte + Barba',
        descricao: 'Combo completo para o visual perfeito',
        preco: 55,
        tempo: '60 min',
        imagem: '/static/assets/pexels-cottonbro-3998415.webp'
    },

    infantil: {
        nome: 'Infantil',
        descricao: 'Corte especial para crianças',
        preco: 25,
        tempo: '35 min',
        imagem: '/static/assets/mostafa_meraji-barber-6818714_1280.webp'
    },

    sobrancelha: {
        nome: 'Sobrancelha',
        descricao: 'Design e alinhamento preciso',
        preco: 15,
        tempo: '15 min',
        imagem: '/static/assets/pexels-cottonbro-3998428.webp'
    },

    platinado: {
        nome: 'Platinado',
        descricao: 'Descoloração completa profissional',
        preco: 80,
        tempo: '90 min',
        imagem: '/static/assets/pexels-pavel-danilyuk-7518760.webp'
    },
}

const barbeiros = {
    joao: {
        nome: 'João',
        especialidade: 'Cortes clássicos',
        foto: '/static/assets/brilhos.svg'
    },

    pedro: {
        nome: 'Pedro',
        especialidade: 'Barba e design',
        foto: '/static/assets/premio.svg'
    },

    carlos: {
        nome: 'Carlos',
        especialidade: 'Todos os estilos',
        foto: '/static/assets/delfina-pan-wJoB8D3hnzc-unsplash.webp'
    }
}

const botoesCorte = document.querySelectorAll('[data-corte]')
let corteSelecionado = null

botoesCorte.forEach((botao) => {
    botao.addEventListener('click', (evento) => {
        evento.preventDefault()
        const corteClicado = botao.getAttribute('data-corte')
        corteSelecionado = cortes[corteClicado]

        localStorage.setItem('corteSelecionado', JSON.stringify(corteSelecionado))
        window.location = '/agendamentos'
    })
})
if (document.getElementById('corte-nome')) {
    corteSelecionado = JSON.parse(localStorage.getItem('corteSelecionado'))
    document.getElementById('corte-nome').textContent = corteSelecionado.nome
    document.getElementById('corte-descricao').textContent = corteSelecionado.descricao
    document.getElementById('corte-preco').textContent = corteSelecionado.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    document.getElementById('corte-tempo').textContent = corteSelecionado.tempo
    document.getElementById('corte-imagem').src = corteSelecionado.imagem
    const btnVoltarDashboard = document.querySelector('button#btn-voltar-dashboard').addEventListener('click', (evento) => {
        window.location = '/dashboard'
    })

    function buscarHorarios(barbeiro, data) {
        const duracao = corteSelecionado.tempo.split(' ')[0]
        const grade = document.getElementById('grade-horarios')
        fetch(`/consulta-horarios?barbeiro=${barbeiro}&data=${data}&duracao=${duracao}`, {
            method: 'GET',
        })
            .then(resposta => resposta.json())
            .then(dado => {
                if (dado.erro) {
                    mostrarMensagem(respostaAgendamento, dado.erro)
                    console.log('Resposta do Backend:', dado)
                    grade.innerHTML = ''
                } else {
                    respostaAgendamento.innerHTML = ''
                    grade.innerHTML = ''
                    dado.horarios.forEach(horario => {
                        const btn = document.createElement('button')
                        btn.textContent = horario
                        btn.onclick = () => {
                            document.querySelectorAll('#grade-horarios button').forEach(b => {
                                b.classList.remove('horario-selecionado')
                            })
                            btn.classList.add('horario-selecionado')
                            horarioSelecionado = horario // Guarda o horário escolhido
                        }
                        grade.appendChild(btn)
                    })
                    console.log('Resposta do Backend:', dado)
                }
            })
    }

    let horarioSelecionado = null
    document.getElementById('agendamento-data').addEventListener('change', () => {
        const barbeiro = document.getElementById('barbeiro-select').value
        const data = document.getElementById('agendamento-data').value
        const duracao = corteSelecionado.tempo.split(' ')[0]

        if (barbeiro && data) {
            buscarHorarios(barbeiro, data, duracao)
        }
    })

    const select = document.getElementById('barbeiro-select')
    select.addEventListener('change', () => {
        const barbeiroSelecionado = document.getElementById('barbeiro-select').value
        const data = document.getElementById('agendamento-data').value

        if (data && barbeiroSelecionado) {
            buscarHorarios(barbeiroSelecionado, data)
        }

        const dadosBarbeiro = barbeiros[barbeiroSelecionado]

        document.getElementById('barbeiro-nome').textContent = dadosBarbeiro.nome
        document.getElementById('especialidade-corte').textContent = dadosBarbeiro.especialidade
        document.getElementById('barbeiro-imagem').src = dadosBarbeiro.foto
    })

    const botaoConfirmar = document.getElementById('btn-confirmar-agendamento')
    const respostaAgendamento = document.querySelector('div#erro-agendamento')

    botaoConfirmar.addEventListener('click', () => {
        const nomeCliente = document.querySelector('input#cliente-nome').value
        const telefoneCliente = document.querySelector('input#cliente-telefone').value
        const dataAgendamento = document.querySelector('input#agendamento-data').value
        const observacao = document.querySelector('textarea#agendamento-observacoes').value

        const nomeCorte = document.getElementById('corte-nome').textContent
        const nomeBarbeiro = document.getElementById('barbeiro-nome').textContent


        if (nomeCliente.length == 0 || telefoneCliente.length == 0 || dataAgendamento.length == 0 || !horarioSelecionado || nomeBarbeiro.length == 0) {
            alert('😊 Ei! Parece que você deixou alguns campos em branco.\nPreencha tudo direitinho e tente novamente!')
            return
        } else {
            const dados = {
                nome_cliente: nomeCliente,
                whatsapp: telefoneCliente,
                corte_nome: nomeCorte,
                corte_descricao: corteSelecionado.descricao,
                tempo_corte: corteSelecionado.tempo,
                corte_preco: corteSelecionado.preco,
                data_hora: `${dataAgendamento} ${horarioSelecionado}:00`,
                barbeiro: nomeBarbeiro,
                observacao: observacao
            }
            console.log('Barbeiro: ', nomeBarbeiro)
            console.log('Dados: ', dados)
            fetch('/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })
                .then(response => response.json())
                .then(dado => {
                    if (dado.erro) {
                        mostrarMensagem(respostaAgendamento, dado.erro)
                        console.log('Resposta do Backend:', dado);
                    } else {
                        mostrarMensagem(respostaAgendamento, dado.mensagem)
                        console.log('Resposta do Backend:', dado.id);
                        window.location = `/confirmacao?id=${dado.id}`
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Erro ao salvar agendamento!');
                });
        }
    })
}