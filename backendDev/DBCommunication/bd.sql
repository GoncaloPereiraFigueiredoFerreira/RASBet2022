DROP DATABASE Rasbet;
CREATE DATABASE IF NOT EXISTS RASBET;
USE RASBET;


CREATE TABLE IF NOT EXISTS Funcionario (
    Email VARCHAR(75) NOT NULL UNIQUE,
    PlvPasse VARCHAR(75) NOT NULL,
    FRole ENUM("Admin","Special"),
    PRIMARY KEY(Email)
);

-- Tabelas relacionadas com Apostador e Promocao



CREATE TABLE IF NOT EXISTS Apostador (
    Email VARCHAR(75) NOT NULL UNIQUE,
    NIF VARCHAR(8) NOT NULL UNIQUE,
    Telemovel VARCHAR(9) NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    Morada VARCHAR(120) NOT NULL,
    DataNascimento DATE NOT NULL,
    Balance decimal(15,2) NOT NULL,
    PlvPasse VARCHAR(75) NOT NULL,
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
    Tipo ENUM("AG", "AP","LC","DC") NOT NULL,
    DataTr DATETIME NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(ApostadorID)
        REFERENCES Apostador(Email)

);


-- Tabelas relacionadas com Aposta e Evento

CREATE TABLE IF NOT EXISTS Aposta (
    ID INT NOT NULL AUTO_INCREMENT,
    ApostadorID VARCHAR(75) NOT NULL,
    Odd FLOAT NOT NULL,
    Montante decimal(15,2) NOT NULL,
    Estado INT NOT NULL,
    Escolha INT NOT NULL,
    DateAp DATETIME NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY (ApostadorID)
        REFERENCES Apostador(Email)
);

CREATE TABLE IF NOT EXISTS Evento(
    ID INT NOT NULL,
    Resultado INT NOT NULL,
    Descricao VARCHAR(255),
    -- sem odds, nao iniciado, a decorrer, finalizado 
    Estado ENUM("SO","NI","AD","FN") NOT NULL,
    Desporto  ENUM("FB","F1","TN","BB") NOT NULL,
    PRIMARY KEY(ID,Desporto)
);

CREATE TABLE IF NOT EXISTS Aposta_Evento(
	ApostaID INT NOT NULL,
    EventoID INT NOT NULL,
    PRIMARY KEY(ApostaID,EventoID),
    FOREIGN KEY(ApostaID)
		REFERENCES Aposta(ID),
	FOREIGN KEY(EventoID)
		REFERENCES Evento(ID)
);


