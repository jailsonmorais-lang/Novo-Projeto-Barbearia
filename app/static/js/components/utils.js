/* REGEX GLOBAIS */
const regexNome = /^[A-Za-zÀ-ÿ\s]{3,70}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* FUNÇÃO QUE MOSTRA MENSAGENS DE ERROS COM ESTILIZAÇÃO */
function mostrarMensagem(elemento, texto) {
    elemento.innerHTML = texto
    elemento.style.textShadow = '0 1px 20px rgba(237, 58, 58, 0.9)'
    elemento.style.color = 'white'
}


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