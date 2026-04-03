/* ====== RECUPERAÇÃO DE SENHA ====== */
const btnEnviarCodigo = document.querySelector('a#enviarcodigo')
let emailRecupera = document.querySelector('input#whatsapp-recuperar')
const respostaRecuperaSenha = document.querySelector('div#erro-recupera-senha')
const btnVerificarCodigo = document.querySelector('button#btn-verificar-codigo')
let codigo = document.querySelector('input#codigo')




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