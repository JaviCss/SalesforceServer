CREATE DATABASE webserversalesforce ;


/* Selecciono la Base de Datos */
\c webserverdb;



CREATE TABLE usuarios ( id SERIAL PRIMARY KEY, consumeri VARCHAR(100) , consumers VARCHAR(100) ,tokenrefresh VARCHAR(100), instance_url TEXT, domain TEXT);

INSERT INTO usuarios(consumeri, consumers, tokenrefresh, domain) VALUES
        ('consumeri', 'consumers', 'tokenrefresh', 'joaquin.decima@gmail.com'),
        ('39423029', 'Pato', 'Decima', 'patojad96@gmail.com');

\dt

DROP TABLE IF EXISTS usuarios CASCADE        