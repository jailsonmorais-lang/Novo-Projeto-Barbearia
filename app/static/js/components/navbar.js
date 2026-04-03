// Aguarda o HTML carregar completamente antes de executar o código
document.addEventListener('DOMContentLoaded', function () {
    
    // Seleciona todos os botões da navbar
    const botoesNavbar = document.querySelectorAll('.nav-button');

    botoesNavbar.forEach(botao => {
        
        // Quando o mouse ENTRA no botão: aumenta levemente o tamanho
        botao.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });

        // Quando o mouse SAI do botão: volta ao tamanho original
        botao.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });

        // Quando CLICA no botão: encolhe rapidamente e volta ao normal (efeito de "pressionar")
        botao.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150); // 150ms depois volta ao tamanho normal
        });
    });

    // Guarda a posição atual do scroll para comparar depois
    let ultimaPosicaoScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const posicaoAtualScroll = window.scrollY;

        if (posicaoAtualScroll > ultimaPosicaoScroll) {
            // Rolando para BAIXO: sobe a navbar levemente e deixa transparente
            navbar.style.transform = 'translateX(-50%) translateY(-10px)';
            navbar.style.opacity = '0.8';
        } else {
            // Rolando para CIMA: volta a navbar para posição original e totalmente visível
            navbar.style.transform = 'translateX(-50%) translateY(0)';
            navbar.style.opacity = '1';
        }

        // Atualiza a posição para a próxima comparação
        ultimaPosicaoScroll = posicaoAtualScroll;
    });
});