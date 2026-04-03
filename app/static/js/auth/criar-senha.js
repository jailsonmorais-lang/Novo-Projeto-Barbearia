/* ====== REDEFINIR SENHA ====== */
const btnRedefinirSenha = document.querySelector('button#redefinir-senha')
let novaSenha = document.querySelector('input#nova-senha')
let confirmarNovaSenha = document.querySelector('input#confirmar-nova-senha')
const respostaCriarNovaSenha = document.querySelector('div#erro-criar-nova-senha')


if (btnRedefinirSenha) {
    btnRedefinirSenha.addEventListener('click', (evento) => {
        evento.preventDefault()
        if (novaSenha.value.length == 0) {
            mostrarMensagem(respostaCriarNovaSenha, 'Digite nova senha!')
        } else if (novaSenha.value.length < 8) {
            mostrarMensagem(respostaCriarNovaSenha, 'Senha deve conter no minimo 8 caracteres')
        } else if (!/[A-Z]/.test(novaSenha.value)) {
            mostrarMensagem(respostaCriarNovaSenha, 'Senha deve conter pelo menos uma letra maiúscula')
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