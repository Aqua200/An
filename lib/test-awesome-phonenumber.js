import PhoneNumber from 'awesome-phonenumber';

const number = new PhoneNumber('+1234567890');
console.log(number.isValid());  // Debería imprimir: true o false dependiendo del número
