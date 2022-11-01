DROP DATABASE RASBET;
CREATE DATABASE IF NOT EXISTS RASBET;
USE RASBET;


CREATE TABLE IF NOT EXISTS Funcionario (
    Email VARCHAR(75) NOT NULL UNIQUE,
    PlvPasse VARCHAR(75) NOT NULL,
    FRole ENUM("Admin","Special"),
    PRIMARY KEY(Email)
);

CREATE TABLE IF NOT EXISTS Apostador (
    Email VARCHAR(75) NOT NULL UNIQUE,
    NIF VARCHAR(8) NOT NULL UNIQUE,
    Telemovel VARCHAR(9) NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    Morada VARCHAR(120) NOT NULL,
    DataNascimento DATE NOT NULL,
    Balance decimal(15,2) NOT NULL,
    PlvPasse VARCHAR(75) NOT NULL,
    CC VARCHAR(10) NOT NULL,
    PRIMARY KEY(Email)   
);

CREATE TABLE IF NOT EXISTS Promocao(
	Codigo VARCHAR(15) NOT NULL UNIQUE,
    Valor INT NOT NULL,
    PRIMARY KEY(Codigo)
);

CREATE TABLE IF NOT EXISTS Promocao_Apostador(
	Codigo VARCHAR(15) NOT NULL,
    ApostadorID VARCHAR(75) NOT NULL,
    PRIMARY KEY(Codigo,ApostadorID),
    FOREIGN KEY (Codigo)
		REFERENCES Promocao(Codigo),
	FOREIGN KEY(ApostadorID)
		REFERENCES Apostador(Email)
);

CREATE TABLE IF NOT EXISTS Transacao(
    ID INT NOT NULL AUTO_INCREMENT,
    ApostadorID VARCHAR(75) NOT NULL,
    Valor decimal(15,2) NOT NULL,
    Tipo ENUM("Aposta_Ganha", "Aposta","Levantamento_Conta","Deposito_Conta","Refund") NOT NULL,
    DataTr DATETIME NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(ApostadorID)
        REFERENCES Apostador(Email)

);

CREATE TABLE IF NOT EXISTS Aposta (
    ID INT NOT NULL AUTO_INCREMENT,
    ApostadorID VARCHAR(75) NOT NULL,
    Odd FLOAT NOT NULL,
    Montante decimal(15,2) NOT NULL,
    Estado ENUM("PEN","WON","LOST","CLS") NOT NULL,
    
    DateAp DATETIME NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY (ApostadorID)
        REFERENCES Apostador(Email)
);

CREATE TABLE IF NOT EXISTS Evento(
    ID VARCHAR(25) NOT NULL,
    Desporto ENUM("FUT","FUTPT","BSK","F1") NOT NULL,
    Resultado INT NOT NULL,
    Descricao VARCHAR(255),
    Estado ENUM("BET","FIN","CLS") NOT NULL,
    Liga VARCHAR(50),
    DataEvent DATETIME NOT NULL,
    PRIMARY KEY(ID,Desporto)
);

CREATE TABLE IF NOT EXISTS Aposta_Evento(
	ApostaID INT NOT NULL,
    EventoID VARCHAR(25) NOT NULL,
    Desporto ENUM("FUT","FUTPT","BSK","F1") NOT NULL,
    Escolha INT NOT NULL,
    PRIMARY KEY(ApostaID,EventoID),
    FOREIGN KEY(ApostaID)
		REFERENCES Aposta(ID),
    FOREIGN KEY(EventoID,Desporto)
		REFERENCES Evento(ID,Desporto)
);

INSERT INTO Funcionario(Email,PlvPasse,FRole) VALUES ("special@coisas.pt","12345","Special");
INSERT INTO Funcionario(Email,PlvPasse,FRole) VALUES ("admin@coisas.pt","12345","Admin");


