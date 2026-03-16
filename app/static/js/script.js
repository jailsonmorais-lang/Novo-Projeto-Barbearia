/* ====== VARIÁVEIS GLOBAIS ====== */
// Login
const email = document.querySelector('input#email-login')                 /* Email de login */
const senha = document.querySelector('input#password-login')              /* Senha de login */
const erroLogin = document.querySelector('div#erro-login')                  /* div para mostrar erro no momento do login */
const btnLogin = document.querySelector('button#btn-login')

// Cadastro
const regexNome = /^[A-Za-zÀ-ÿ\s]{3,70}$/                                 /* Receita para validar nomes */
const nomeCadastro = document.querySelector('input#nome-criar')           /* Nome para criar nova conta */
const emailCadastro = document.querySelector('input#email-cadastro')      /* Email para cadastro */
const senhaCadastro = document.querySelector('input#password-criar')      /* Senha para cadastro */
const senhaConfirmar = document.querySelector('input#password-confirmar') /* Confirmar a senha de cadastro */
const whatsapp = document.querySelector('input#whatsapp')                 /* Whatsapp para cadastro */
const erroCadastro = document.querySelector('div#erro-cadastro')
const btnCadastrar = document.querySelector('button#btn-cadastrar')

// Gerar código para criar nova senha
let codigoGerado = ''
const erroRecuperaSenha = document.querySelector('div#erro-recupera-senha')
let codigo = document.querySelector('input#codigo')
let whatsRecupera = document.querySelector('input#whatsapp-recuperar')
const whatsappsRegistrados = ['61999999999']
let novaSenha = document.querySelector('input#nova-senha')
let confirmarNovaSenha = document.querySelector('input#confirmar-nova-senha')
let erroCriarNovaSenha = document.querySelector('div#erro-criar-nova-senha')

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
    elemento.style.textShadow = '0 10px 20px rgba(237, 58, 58, 0.9)'
}

/* FUNÇÃO PARA LIMPAR CAMPOS */
function limparCadastro() {
    nomeCadastro.value = ''
    emailCadastro.value = ''
    senhaCadastro.value = ''
    senhaConfirmar.value = ''
    whatsapp.value = ''
    erro.innerHTML = ''
    erro.style.textShadow = ''
    erroCriarNovaSenha.innerHTML = ''
    erroCriarNovaSenha.style.textShadow = ''
    email.value = ''
    senha.value = ''
    retorno.innerHTML = ''
    retorno.style.textShadow = ''
    erroRecuperaSenha.innerHTML = ''
    erroRecuperaSenha.style.textShadow = ''
    codigo.value = ''
    whatsRecupera.value = ''
    novaSenha.value = ''
    confirmarNovaSenha.value = ''
    codigoGerado = ''
}

/* ====== VALIDAÇÃO DE LOGIN ====== */
// Responsáveis por validar dados do formulário de login
//Retornam mensagens de erro ou executam ação de sucesso
if (btnLogin) {
    document.querySelector('button#btn-login').addEventListener('click', (evento) => {
        evento.preventDefault()
        if (email.value.length == 0) {
            alert('Campo de Email obrigatório')
        } else if (!email.value.includes('@')) {
            mostrarMensagem(erroLogin, 'Email invalido!')
        } else if (senha.value.length < 8) {
            mostrarMensagem(erroLogin, 'A senha deve conter pelo menos 8 caracteres')
        } else if (!/[A-Z]/.test(senha.value)) {
            mostrarMensagem(erroLogin, 'Senha deve conter pelo menos uma letra maiúscula')
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
                    erroLogin.innerHTML = dados.erro
                } else {
                    alert('Login realizado com sucesso!');
                    window.location = '/dashboard'
                }
            })
        }
    })
}
    
    /* ====== VALIDAÇÃO DE CADASTRO ====== */
if (btnCadastrar) {
    document.querySelector('button#btn-cadastrar').addEventListener('click', (evento) => {
        evento.preventDefault()
        if (nomeCadastro.value.length == 0) {
            mostrarMensagem(erroCadastro, 'Campo "Nome" não pode ficar em branco')
        } else if (/[0-9]/.test(nomeCadastro.value)) {
            mostrarMensagem(erroCadastro, 'Nome não pode ter números.')
        } else if (!regexNome.test(nomeCadastro.value)) {
            mostrarMensagem(erroCadastro, 'Nome tem caracteres invalidos.')
        } else if (nomeCadastro.value.length < 3 || nomeCadastro.value.length > 50) {
            mostrarMensagem(erroCadastro, 'Nome muito curto ou muito longo')
        } else if (emailCadastro.value.length == 0) {
            mostrarMensagem(erroCadastro, 'Campo "Email" não pode ficar em branco.')
        } else if (!emailCadastro.value.includes('@')) {
            mostrarMensagem(erroCadastro, 'Email invalido.')
        } else if (senhaCadastro.value.length < 8) {
            mostrarMensagem(erroCadastro, 'Senha deve conter no minimo 8 caracteres')
        } else if (!/[A-Z]/.test(senhaCadastro.value)) {
            mostrarMensagem(erroCadastro, 'Senha deve conter pelo menos uma letra maiúscula')
    } else if (senhaConfirmar.value !== senhaCadastro.value) {
        mostrarMensagem(erroCadastro, 'As senhas não coincidem!')
    } else if (whatsapp.value.length < 11) {
        mostrarMensagem(erroCadastro, 'Número de WhatsApp invalido')
    } else if (!/^[0-9]{11}$/.test(whatsapp.value.replace(" ", ''))) {
        mostrarMensagem(erroCadastro, 'Número de WhatsApp invalido')
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
                erroCadastro.innerHTML = dados.erro
            } else {
                erroCadastro.innerHTML = dados.mensagem
                window.location = '/'
            }
        })
    }
}
)
}

/* document.querySelector('button#btn-verificar-codigo').addEventListener('click', (evento) => {
    evento.preventDefault()
    recuperarSenha()
})

document.querySelector('#tela-recuperar-senha a[href="#enviarcodigo"]').addEventListener('click', (evento) => {
    evento.preventDefault()
    enviarCodigo()

})

document.querySelector('button#redefinir-senha').addEventListener('click', (evento) => {
    evento.preventDefault()
    criarNovaSenha()
}) */

/* ====== RECUPERAÇÃO DE SENHA ====== */

function enviarCodigo() {
    if (whatsRecupera.value.length < 11) {
        erroRecuperaSenha.innerHTML = 'Número de WhatsApp invalido'
        erroRecuperaSenha.style.textShadow = erro
    } else if (!/^[0-9]{11}$/.test(whatsRecupera.value.replace(" ", ''))) {
        erroRecuperaSenha.innerHTML = 'Número de WhatsApp invalido'
        erroRecuperaSenha.style.textShadow = erro
    } else if (!whatsappsRegistrados.includes(whatsRecupera.value)) {
        erroRecuperaSenha.innerHTML = 'Número de WhatsApp não encontrado!'
        erroRecuperaSenha.style.textShadow = erro
    } else {
        codigoGerado = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
        console.log('Codigo gerado:', codigoGerado)
        erroRecuperaSenha.innerHTML = 'Código enviado! Verifique seu WhatsApp'
        erroRecuperaSenha.style.textShadow = ''
    }
}

function recuperarSenha() {
    if (whatsRecupera.value.length < 11) {
        erroRecuperaSenha.innerHTML = 'Número de WhatsApp invalido'
        erroRecuperaSenha.style.textShadow = erro
    } else if (!/^[0-9]{11}$/.test(whatsRecupera.value.replace(" ", ''))) {
        erroRecuperaSenha.innerHTML = 'Número de WhatsApp invalido'
        erroRecuperaSenha.style.textShadow = erro
    } else if (!whatsappsRegistrados.includes(whatsRecupera.value)) {
        erroRecuperaSenha.innerHTML = 'Número de WhatsApp não encontrado!'
        erroRecuperaSenha.style.textShadow = erro
    } else if (codigo.value.length > 6 || codigo.value.length < 6) {
        erroRecuperaSenha.innerHTML = 'Código deve conter 6 digitos'
        erroRecuperaSenha.style.textShadow = erro
    } else if (codigo.value !== codigoGerado) {
        erroRecuperaSenha.innerHTML = 'Código INCORRETO'
        erroRecuperaSenha.style.textShadow = erro
    } else {

    }
}

function criarNovaSenha() {
    if (novaSenha.value.length < 8) {
        erroCriarNovaSenha.innerHTML = 'Senha deve conter no minimo 8 caracteres'
        erroCriarNovaSenha.style.textShadow = erro
    } else if (!/[A-Z]/.test(novaSenha.value)) {
        erroCriarNovaSenha.innerHTML = 'Senha deve conter uma letra maiúscula'
        erroCriarNovaSenha.style.textShadow = erro
    } else if (confirmarNovaSenha.value !== novaSenha.value) {
        erroCriarNovaSenha.innerHTML = 'As senhas não coincidem!'
        erroCriarNovaSenha.style.textShadow = erro
    } else {

    }
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

botoesCorte.forEach((botao) => {
    botao.addEventListener('click', () => {
        const corteClicado = botao.getAttribute('data-corte')
        const dadosCorte = cortes[corteClicado]

        document.getElementById('corte-nome').textContent = dadosCorte.nome
        document.getElementById('corte-descricao').textContent = dadosCorte.descricao
        document.getElementById('corte-preco').textContent = dadosCorte.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        document.getElementById('corte-tempo').textContent = dadosCorte.tempo
        document.getElementById('corte-imagem').src = dadosCorte.imagem
    })
})

const select = document.getElementById('barbeiro-select')
select.addEventListener('change', () => {
    const barbeiroSelecionado = select.value

    if (barbeiroSelecionado === '') {
        return
    }

    const dadosBarbeiro = barbeiros[barbeiroSelecionado]

    document.getElementById('barbeiro-nome').textContent = dadosBarbeiro.nome
    document.getElementById('especialidade-corte').textContent = dadosBarbeiro.especialidade
    document.getElementById('barbeiro-imagem').src = dadosBarbeiro.foto

})

const botaoConfirmar = document.getElementById('btn-confirmar-agendamento')

botaoConfirmar.addEventListener('click', () => {
    const nomeCliente = document.querySelector('input#cliente-nome').value
    const telefoneCliente = document.querySelector('input#cliente-telefone').value
    const dataAgendamento = document.querySelector('input#agendamento-data').value
    const horaAgendamento = document.querySelector('input#agendamento-hora').value
    const observacao = document.querySelector('textarea#agendamento-observacoes').value

    const nomeCorte = document.getElementById('corte-nome').textContent
    const precoCorte = document.getElementById('corte-preco').textContent
    const nomeBarbeiro = document.getElementById('barbeiro-nome').textContent

    const dados = {
        nome: nomeCliente,
        telefone: telefoneCliente,
        data: dataAgendamento,
        hora: horaAgendamento,
        barbeiro: nomeBarbeiro,
        corte: nomeCorte
    }

    const mensagem = `
╔════════════════════════════╗
║      CONFIRMAÇÃO DE AGENDAMENTO        ║
╚════════════════════════════╝

► Olá! Meu nome é: *${nomeCliente}*

► Celular: *${telefoneCliente}*

◆ DETALHES DO AGENDAMENTO ◆

► Data: ${dataAgendamento}
► Hora: ${horaAgendamento}

► Serviço: *${nomeCorte}*
► Profissional: *${nomeBarbeiro}*
► Valor: *${precoCorte}*

◆ Observação ◆
*${observacao}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Aguardando confirmação!

Obrigado pela preferência!
Barbearia Morais - Excelência em Cortes`

    const mensagemCodificada = encodeURIComponent(mensagem)

    if (nomeCliente.length == 0 || telefoneCliente.length == 0 || dataAgendamento.length == 0 || horaAgendamento.length == 0 || nomeBarbeiro.length == 0) {
        alert('😊 Ei! Parece que você deixou alguns campos em branco.\n\nPreencha tudo direitinho e tente novamente!')
        return
    } else {
        window.open(`https://wa.me/5561998729994?text=${mensagemCodificada}`, '_blank')
        /* fetch('/agendamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta do Backend:', data);
                alert('Agendamento salvo com sucesso!');
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao salvar agendamento!');
            }); */
    }
})

