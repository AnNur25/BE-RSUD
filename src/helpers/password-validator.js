const owasp = require("owasp-password-strength-test");

owasp.config({
  allowPassphrases: false, //Tidak izinkan frasa kata
  minLength: 10,
  minOptionalTestsToPass: 4, //Tes ini mencakup: huruf besar, huruf kecil, angka, dan simbol.
});

function validatePasswordStrength(password) {
  const result = owasp.test(password);
  if (!result.strong) {
    const message = result.errors.join(" ");
    throw new Error(`Password lemah: ${message}`);
  }
}

module.exports = {
  validatePasswordStrength,
};
