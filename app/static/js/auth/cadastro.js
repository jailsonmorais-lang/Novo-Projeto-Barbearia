// Cadastro
const nomeCadastro = document.querySelector('input#nome-criar')           /* Nome para criar nova conta */
const emailCadastro = document.querySelector('input#email-cadastro')      /* Email para cadastro */
const senhaCadastro = document.querySelector('input#password-criar')      /* Senha para cadastro */
const senhaConfirmar = document.querySelector('input#password-confirmar') /* Confirmar a senha de cadastro */
const whatsapp = document.querySelector('input#whatsapp')                 /* Whatsapp para cadastro */
const respostaCadastro = document.querySelector('div#erro-cadastro')
const btnCadastrar = document.querySelector('button#btn-cadastrar')

if (btnCadastrar) {
    btnCadastrar.addEventListener('click', (evento) => {
        evento.preventDefault()
        if (nomeCadastro.value.length == 0) {
            mostrarMensagem(respostaCadastro, 'Campo "Nome" não pode ficar em branco!')

        } else if (/[0-9]/.test(nomeCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Nome não pode ter números!')
            
        } else if (nomeCadastro.value.length < 3) {
            mostrarMensagem(respostaCadastro, 'Nome muito curto!')

        } else if (!regexNome.test(nomeCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Nome tem caracteres invalidos!')

        } else if (emailCadastro.value.length == 0) {
            mostrarMensagem(respostaCadastro, 'Campo "Email" não pode ficar em branco!')

        } else if (!regexEmail.test(emailCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Email invalido!')

        } else if (senhaCadastro.value.length < 8) {
            mostrarMensagem(respostaCadastro, 'Senha deve conter no minimo 8 caracteres!')

        } else if (!/[A-Z]/.test(senhaCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Senha deve conter pelo menos uma letra maiúscula!')
        
        } else if (!/[0-9]/.test(senhaCadastro.value)) {
            mostrarMensagem(respostaCadastro, 'Senha deve conter pelo menos um número!')

        } else if (senhaConfirmar.value !== senhaCadastro.value) {
            mostrarMensagem(respostaCadastro, 'As senhas não coincidem!')

        } else if (whatsapp.value.length < 11) {
            mostrarMensagem(respostaCadastro, 'Número de WhatsApp invalido!')

        } else if (!/^[0-9]{11}$/.test(whatsapp.value.replace(" ", ''))) {
            mostrarMensagem(respostaCadastro, 'Número de WhatsApp invalido!')

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