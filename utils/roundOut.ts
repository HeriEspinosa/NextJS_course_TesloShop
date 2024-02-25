export function roundOutDecimals(numero: number, decimales: number = 2) {
    const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');
    if (numeroRegexp.test(numero.toString())) {
        // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
        return Number(numero.toFixed(decimales));
    } else {
        return Number(numero.toFixed(decimales)) === 0 ? 0 : numero; // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    }
}
