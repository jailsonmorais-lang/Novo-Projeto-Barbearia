// Login
const email = document.querySelector('input#email-login')                 /* Email de login */
const senha = document.querySelector('input#password-login')              /* Senha de login */
const respostaLogin = document.querySelector('div#erro-login')            /* div para mostrar reposta no momento do login */
const btnLogin = document.querySelector('button#btn-login')

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