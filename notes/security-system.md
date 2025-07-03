# Catatan Ngoding

## Keamanan yang digunakan di sistem ini

- **XSS attack**: Menggunakan HttpOnly dengan penyimpanan di cookies.  
- **CSRF attack**: karena Config cookies menggunakan sameSate none, rawan akan CSRF. Maka diminimalisir oleh CSRF-token atau dengan sameSate lax.
- **Brute Force attack**: Dengan password menggunakan package Owasp (minimal 10 karakter yang terdiri dari huruf kecil, huruf besar, angka, simbol.) dan dengan memberikan limit sebanyak 6 kali ketika login.

---
