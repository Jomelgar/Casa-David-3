function formatearValor(valor, formato, esBorrado = false) {
  // Eliminar caracteres no numéricos (excepto los guiones)
  let soloNumeros = valor.replace(/\D/g, '');

  let resultado = '';
  let indice = 0;

  // Si el valor está siendo borrado, debemos trabajar con los números de una manera especial
  if (esBorrado) {
    // Si está borrando, aseguramos que se actualice adecuadamente
    // Eliminar el último número del valor
    soloNumeros = soloNumeros.slice(0, -1);
  }

  // Iterar sobre el formato para aplicar el formateo
  for (let i = 0; i < formato.length; i++) {
    const caracter = formato[i];
    
    if (caracter === '#') {
      // Si es un '#', añadir un número del valor
      if (indice < soloNumeros.length) {
        resultado += soloNumeros[indice];
        indice++;
      } else {
        // Si no quedan más números, dejar el espacio vacío
        break;
      }
    } else if (caracter === '-') {
      // Si es un '-', añadir el guion
      resultado += '-';
    } else {
      // Si el formato tiene otros caracteres (como letras), agregarlos directamente
      resultado += caracter;
    }
  }

  return resultado;
}

export default formatearValor;
