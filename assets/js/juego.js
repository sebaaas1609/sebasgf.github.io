// Modulo
const miModulo = (() =>{
    'use strict'

    let deck = [];
    const tipos = ['C','D','H','S'],
        especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];
    //Referencias HTML
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
        ptsHTML = document.querySelectorAll('small');

    // Inicializacion del juego

    const inicializarJuego = ( numJugadores = 2) =>{
        console.clear();
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        ptsHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = "");

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    //Crea una nueva baraja
    const crearDeck = ()=>{
        deck = [];
        for(let i = 2; i <= 10; i++){
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for(let tipo of tipos){
            for(let esp of especiales){
                deck.push(esp + tipo)
            }
        }

        return _.shuffle(deck);;
    }

    crearDeck();

    //Tomar una carta
    const pedirCarta = ()=>{

        if( deck.length === 0){
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    const valorCarta = (carta) =>{
        const valor = carta.substring(0,carta.length-1);
        return (isNaN(valor)) ? 
        ((valor === 'A') ? 11 : 10)
        : valor * 1;
    }

    const acumularPuntos = (carta, turno) =>{
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        ptsHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGAanador = () =>{
        setTimeout(() => {
            const [puntosMinimos, puntosComputadora] = puntosJugadores;
            if(puntosMinimos <= 21 && puntosComputadora <= 21){
                if(puntosMinimos > puntosComputadora){
                    alert("Has Ganado!");
                }else if (puntosComputadora > puntosMinimos) {
                    alert("Has perdido!")
                }else if(puntosMinimos == puntosComputadora){
                    alert("Empate");
                }
            }else if(puntosComputadora > 21){
                alert("Has ganado!")
            }else if(puntosMinimos > 21){
                alert('Computadora Gano!')
            }
        }, 20);
    }

    //Turno computadora
    const turnoComputadora = (puntosMinimos) =>{
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length-1);
            crearCarta(carta, puntosJugadores.length-1)
            
        } while ( (puntosComputadora < puntosMinimos ) && (puntosMinimos <= 21));
        determinarGAanador();
    }
    //Eventos

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0 );

        crearCarta(carta, 0)
        if (puntosJugadores[0] > 21) {
        console.warn('Perdiste!');
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
         }else if(puntosJugadores[0] == 21){
         console.warn('21 BLACK JACK');
        btnPedir.disabled = true;
       btnDetener.disabled = true;
       turnoComputadora(puntosJugadores[0]);
         }
    });

    btnDetener.addEventListener('click', () =>{
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    return{
        nuevoJuego: inicializarJuego
    };

})();
