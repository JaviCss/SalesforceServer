/* CREADO POR https://patojad.com.ar/ */


/* Creo Base de Datos para el WebServer */
CREATE DATABASE `webserverdb`;

/* Creo el usuario para esta prueba publica */
CREATE USER 'webserversalesforce' IDENTIFIED BY 'webserversalesforcepass';

/* Le concedo permisos para conectarse */
GRANT USAGE ON *.* TO 'webserversalesforce'@localhost IDENTIFIED BY 'webserversalesforcepass';
/* GRANT USAGE ON *.* TO 'testwebserveruser'@'%' IDENTIFIED BY 'testwebserverpass'; // Esto se usar en caso de que se requiera acceder fuera del localhost */

/* Se le da acceso al usuario a la Base de Datos */
GRANT ALL privileges ON `webserverdb`.* TO 'webserversalesforce'@localhost;

/* Aplico los cambios */
FLUSH PRIVILEGES;

/* Selecciono la Base de Datos */
USE webserverdb;

/* Creo trabla para las pruebas */
CREATE TABLE usuarios (
  id BIGINT  AUTO_INCREMENT PRIMARY KEY, /* ID auto incrementable seteado como primary key*/
  consumeri VARCHAR(100) UNIQUE, /* Seteo DNI como unico */
  consumers VARCHAR(100),
  tokenrefresh VARCHAR(100),
  email VARCHAR(100);
);

/* Inserto datos en la Tabla para realizar las pruebas */
INSERT INTO usuarios(consumeri, consumers, tokenrefresh, email) VALUES
        ('consumeri', 'consumers', 'tokenrefresh', 'joaquin.decima@gmail.com'),
        ('39423029', 'Pato', 'Decima', 'patojad96@gmail.com');

/* Muestro los datos */
SELECT * FROM usuarios;

