// Eventos
document.addEventListener('DOMContentLoaded', function() {
    const montoInput = document.getElementById('monto');
    const divisaSelect = document.getElementById('divisa');
    const calcularBtn = document.getElementById('calcular');
    const historialList = document.getElementById('lista-cotizaciones');
    const borrarHistorialBtn = document.getElementById('borrar-historial');

    // Definir cotizaciones estáticas
    const cotizaciones = {
        USD: 2400,
        EUR: 3000,
        GBP: 4500,
        BRL: 2000
    };

    // Funcion para cargar historial
    cargarHistorial();

    // Listener para btn "calcular"
    calcularBtn.addEventListener('click', function() {
        const monto = parseFloat(montoInput.value);
        const divisa = divisaSelect.value;

        if (isNaN(monto) || monto <= 0) {
            alert('Ingrese un monto válido en pesos argentinos.');
            return;
        }

        if (!cotizaciones[divisa]) {
            alert('Seleccione una divisa válida.');
            return;
        }

        const resultado = monto / cotizaciones[divisa];
        const simboloDivisa = obtenerSimboloDivisa(divisa);
        
        mostrarResultado(monto, divisa, resultado.toFixed(2), simboloDivisa);

        guardarEnHistorial(monto, divisa, resultado.toFixed(2), simboloDivisa);
    });

    // Listener para btn "Borrar Historial"
    borrarHistorialBtn.addEventListener('click', function() {
        localStorage.removeItem('historial');
        historialList.innerHTML = '';
    });

    // Cargar el historial
    function cargarHistorial() {
        const historial = JSON.parse(localStorage.getItem('historial')) || [];
        historial.forEach(item => {
            const simboloDivisa = obtenerSimboloDivisa(item.divisa);
            mostrarResultado(item.monto, item.divisa, item.resultado, simboloDivisa);
        });
    }

    // Función para mostrar el resultado 
    function mostrarResultado(monto, divisa, resultado, simbolo) {
        const li = document.createElement('li');
        li.textContent = `${monto} ARS equivale a ${resultado} ${simbolo} (${divisa})`;
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('eliminar');
        btnEliminar.addEventListener('click', function() {
            eliminarDelHistorial(li);
        });
        
        li.appendChild(btnEliminar);
        historialList.appendChild(li);
    }

    // Guardar en el historial en localStorage
    function guardarEnHistorial(monto, divisa, resultado, simbolo) {
        const historial = JSON.parse(localStorage.getItem('historial')) || [];
        historial.push({
            monto: monto,
            divisa: divisa,
            resultado: resultado,
            simbolo: simbolo
        });
        localStorage.setItem('historial', JSON.stringify(historial));
    }

    // Función para obtener el símbolo de la divisa
    function obtenerSimboloDivisa(divisa) {
        switch (divisa) {
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            case 'GBP':
                return '£';
            case 'BRL':
                return 'R$';
            default:
                return '';
        }
    }

    // Función para eliminar una cotización del historial
    function eliminarDelHistorial(item) {
        const historial = JSON.parse(localStorage.getItem('historial')) || [];
        const textoCotizacion = item.textContent.split(' equivale ')[0];
        const nuevoHistorial = historial.filter(cotizacion => {
            const texto = `${cotizacion.monto} ARS equivale a ${cotizacion.resultado} ${cotizacion.simbolo} (${cotizacion.divisa})`;
            return texto !== textoCotizacion;
        });
        localStorage.setItem('historial', JSON.stringify(nuevoHistorial));
        item.remove(item);
    }
});