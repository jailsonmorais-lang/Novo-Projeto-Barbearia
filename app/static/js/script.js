/* ====== VARIÁVEIS GLOBAIS ====== */
// Login
const email = document.querySelector('input#email-login')                 /* Email de login */
const senha = document.querySelector('input#password-login')              /* Senha de login */
const respostaLogin = document.querySelector('div#erro-login')                /* div para mostrar reposta no momento do login */
const btnLogin = document.querySelector('button#btn-login')

// Cadastro
const regexNome = /^[A-Za-zÀ-ÿ\s]{3,70}$/                                 /* Receita para validar nomes */
const nomeCadastro = document.querySelector('input#nome-criar')           /* Nome para criar nova conta */
const emailCadastro = document.querySelector('input#email-cadastro')      /* Email para cadastro */
const senhaCadastro = document.querySelector('input#password-criar')      /* Senha para cadastro */
const senhaConfirmar = document.querySelector('input#password-confirmar') /* Confirmar a senha de cadastro */
const whatsapp = document.querySelector('input#whatsapp')                 /* Whatsapp para cadastro */
const respostaCadastro = document.querySelector('div#erro-cadastro')
const btnCadastrar = document.querySelector('button#btn-cadastrar')

// Gerar código para criar nova senha
let codigoGerado = ''
const btnEnviarCodigo = document.querySelector('a#enviarcodigo')
const btnVerificarCodigo = document.querySelector('button#btn-verificar-codigo')
const btnRedefinirSenha = document.querySelector('button#redefinir-senha')
const respostaRecuperaSenha = document.querySelector('div#erro-recupera-senha')
let codigo = document.querySelector('input#codigo')
let emailRecupera = document.querySelector('input#whatsapp-recuperar')
let novaSenha = document.querySelector('input#nova-senha')
let confirmarNovaSenha = document.querySelector('input#confirmar-nova-senha')
const respostaCriarNovaSenha = document.querySelector('div#erro-criar-nova-senha')
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* BOTÃO PARA VIZUALIZAR SENHAS */

function configurarBotaoMostrarSenha(botaoSeletor, inputSeletor, imgSeletor) {
    const botao = document.querySelector(botaoSeletor)
    const input = document.querySelector(inputSeletor)
    const imagem = document.querySelector(imgSeletor)

    if (!botao || !input || !imagem) return;

    botao.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text'
            imagem.src = '/static/assets/olho-aberto.svg'
        } else {
            input.type = 'password'
            imagem.src = '/static/assets/olho-fechado.svg'
        }
    })
}
configurarBotaoMostrarSenha('#btn-mostrar-senha-login', '#password-login', '#icone-olho-login')
configurarBotaoMostrarSenha('#btn-mostrar-senha-cadastro', '#password-criar', '#icone-olho-criar')
configurarBotaoMostrarSenha('#btn-mostrar-senha-confirmar', '#password-confirmar', '#icone-olho-confirmar')
configurarBotaoMostrarSenha('#btn-mostrar-nova-senha', '#nova-senha', '#icone-olho-nova-senha')
configurarBotaoMostrarSenha('#btn-mostrar-nova-senha-confirmar', '#confirmar-nova-senha', '#icone-olho-confirmar-nova-senha')

/* FUNÇÃO QUE MOSTRA MENSAGENS DE ERROS COM ESTILIZAÇÃO */
function mostrarMensagem(elemento, texto) {
    elemento.innerHTML = texto
    elemento.style.textShadow = '0 1px 20px rgba(237, 58, 58, 0.9)'
    elemento.style.color = 'white'
}

/* FUNÇÃO PARA LIMPAR CAMPOS */
function limparCadastro() {
    nomeCadastro.value = ''
    emailCadastro.value = ''
    senhaCadastro.value = ''
    senhaConfirmar.value = ''
    whatsapp.value = ''
    respostaCriarNovaSenha.innerHTML = ''
    respostaCriarNovaSenha.style.textShadow = ''
    email.value = ''
    senha.value = ''
    respostaRecuperaSenha.innerHTML = ''
    respostaRecuperaSenha.style.textShadow = ''
    codigo.value = ''
    emailRecupera.value = ''
    novaSenha.value = ''
    confirmarNovaSenha.value = ''
    codigoGerado = ''
    dados = ''
}

/* ====== VALIDAÇÃO DE LOGIN ====== */
// Responsáveis por validar dados do formulário de login
//Retornam mensagens de erro ou executam ação de sucesso
if (btnLogin) {
    btnLogin.addEventListener('click', (evento) => {
        evento.preventDefault()
        if (email.value.length == 0) {
            alert('Campo de Email obrigatório')
        } else if (!regexEmail.test(email.value)) {
            mostrarMensagem(respostaLogin, 'Email invalido!')
        } else if (senha.value.length < 8) {
            mostrarMensagem(respostaLogin, 'A senha deve conter pelo menos 8 caracteres')
        } else if (!/[A-Z]/.test(senha.value)) {
            mostrarMensagem(respostaLogin, 'Senha deve conter pelo menos uma letra maiúscula')
        } else {
            const dadosParaLogin = {
                email: email.value,
                senha: senha.value,
            }
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaLogin)
            })
                .then(resposta => resposta.json())
                .then(dados => {
                    if (dados.erro) {
                        respostaLogin.innerHTML = dados.erro
                    } else {
                        mostrarMensagem(respostaLogin, 'Login realizado com sucesso!')
                        window.location = '/dashboard'
                    }
                })
        }
    })
}

/* ====== VALIDAÇÃO DE CADASTRO ====== */

if (btnCadastrar) {
    btnCadastrar.addEventListener('click', (evento) => {
        evento.preventDefault()
        if (nomeCadastro.value.length == 0) {
            mostrarMensagem(respostaCadastro, 'Campo "Nome" não pode ficar em branco')

        } else if (/[0-9]/.test(nomeCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Nome não pode ter números.')

        } else if (!regexNome.test(nomeCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Nome tem caracteres invalidos.')

        } else if (nomeCadastro.value.length < 3 || nomeCadastro.value.length > 50) {
            mostrarMensagem(respostaCadastro, 'Nome muito curto ou muito longo')

        } else if (emailCadastro.value.length == 0) {
            mostrarMensagem(respostaCadastro, 'Campo "Email" não pode ficar em branco.')

        } else if (!regexEmail.test(emailCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Email invalido.')

        } else if (senhaCadastro.value.length < 8) {
            mostrarMensagem(respostaCadastro, 'Senha deve conter no minimo 8 caracteres')
        } else if (!/[A-Z]/.test(senhaCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Senha deve conter pelo menos uma letra maiúscula')
        } else if (senhaConfirmar.value !== senhaCadastro.value) {
            mostrarMensagem(respostaCadastro, 'As senhas não coincidem!')
        } else if (whatsapp.value.length < 11) {
            mostrarMensagem(respostaCadastro, 'Número de WhatsApp invalido')
        } else if (!/^[0-9]{11}$/.test(whatsapp.value.replace(" ", ''))) {
            mostrarMensagem(respostaCadastro, 'Número de WhatsApp invalido')
        } else {

            const dadosCadastro = {
                nome: nomeCadastro.value,
                email: emailCadastro.value,
                senha: senhaCadastro.value,
                whatsapp: whatsapp.value
            }

            fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCadastro)
            })
                .then(resposta => resposta.json())
                .then(dados => {
                    if (dados.erro) {
                        respostaCadastro.innerHTML = dados.erro
                    } else {
                        respostaCadastro.innerHTML = dados.mensagem
                        window.location = '/'
                    }
                })
        }
    }
    )
}

/* ====== RECUPERAÇÃO DE SENHA ====== */

if (btnEnviarCodigo) {
    btnEnviarCodigo.addEventListener('click', (evento) => {
        evento.preventDefault()
        if (emailRecupera.value.length == 0) {
            mostrarMensagem(respostaRecuperaSenha, 'Informe o Email!')
        } else if (!regexEmail.test(emailRecupera.value)) {
            mostrarMensagem(respostaRecuperaSenha, 'Email invalido!')
        } else {
            fetch('/recuperacao-de-senha', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email: emailRecupera.value })
            })
                .then(resposta => resposta.json())
                .then(dados => {
                    if (dados.erro) {
                        mostrarMensagem(respostaRecuperaSenha, dados.erro)
                    } else {
                        mostrarMensagem(respostaRecuperaSenha, 'Código enviado! Verifique seu email')
                    }
                })
                .catch(erro => {
                    console.log('Erro de rede: ', erro)
                    mostrarMensagem(respostaRecuperaSenha, 'Erro de conexão')
                })
        }
    })
}

/* ====== VERIFICAR CÓDIGO ====== */

if (btnVerificarCodigo) {
    btnVerificarCodigo.addEventListener('click', (evento) => {
        evento.preventDefault()
        if (codigo.value.length == 0) {
            mostrarMensagem(respostaRecuperaSenha, 'Digite o código!')
        } else {

            fetch('/validar-codigo', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ codigo: codigo.value })
            })
                .then(resposta => resposta.json())
                .then(dados => {
                    if (dados.erro) {
                        mostrarMensagem(respostaRecuperaSenha, dados.erro)
                    } else {
                        mostrarMensagem(respostaRecuperaSenha, dados.mensagem)
                        window.location = '/criar-senha'
                    }
                })
        }
    })
}

/* ====== REDEFINIR SENHA ====== */

if (btnRedefinirSenha) {
    btnRedefinirSenha.addEventListener('click', (evento) => {
        evento.preventDefault()
        if (novaSenha.value.length == 0 || confirmarNovaSenha.value.length == 0) {
            mostrarMensagem(respostaCriarNovaSenha, 'Digite nova senha!')
        } else if (novaSenha.value !== confirmarNovaSenha.value) {
            mostrarMensagem(respostaCriarNovaSenha, 'As senhas não coincidem!')
        } else {
            fetch('/criar-senha', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ senha: novaSenha.value })
            })
                .then(resposta => resposta.json())
                .then(dados => {
                    if (dados.erro) {
                        mostrarMensagem(respostaCriarNovaSenha, dados.erro)
                    } else {
                        mostrarMensagem(respostaCriarNovaSenha, dados.mensagem)
                        window.location = '/'
                    }
                })
        }
    })
}

/* TELA DE AGENDAMENTO */

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

const cardResumo = document.querySelectorAll('div.card-resumo')
cardResumo.forEach((cards) => {
    cards.addEventListener('click', () => {
        cards.parentElement.classList.toggle('aberto')
        console.log('Clicou no card')
    })
})