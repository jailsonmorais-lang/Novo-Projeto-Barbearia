const cardResumo = document.querySelectorAll('div.card-resumo')
cardResumo.forEach((cards) => {
    cards.addEventListener('click', () => {
        cards.parentElement.classList.toggle('aberto')
        console.log('Clicou no card')
    })
})

document.querySelector('button.btn-voltar').addEventListener('click', (evento) => {
    evento.preventDefault()
    window.location='/dashboard'
})