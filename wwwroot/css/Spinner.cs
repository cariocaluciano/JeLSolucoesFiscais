.loading-screen {
    display: none; /* Inicialmente escondida */
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100 %;
    height: 100 %;
    background-color: rgba(0, 0, 0, 0.5); /* Cor de fundo semi-transparente */
    color: black;
    text-align: center;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Mantém a tela de carregamento acima de outros elementos */
}

.spinner {
    border: 8px solid black;
    border-radius: 50 %;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

.loading - screen p { 
    margin-left:15px;
}

@keyframes spin
{
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}