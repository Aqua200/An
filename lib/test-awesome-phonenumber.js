import PhoneNumber from 'awesome-phonenumber';

const validatePhoneNumber = (phone) => {
  // Verificamos si el número es válido antes de intentar analizarlo
  if (!phone) {
    console.error('Por favor, ingrese un número de teléfono válido.');
    return;
  }

  // Creamos una instancia de PhoneNumber
  const number = new PhoneNumber(phone);

  // Verificamos si el número es válido
  if (number.isValid()) {
    console.log(`El número ${phone} es válido.`);
  } else {
    console.log(`El número ${phone} no es válido.`);
  }
};

// Ejemplo de número a validar
const phone = '+1234567890'; // Puedes cambiar este número
validatePhoneNumber(phone);
