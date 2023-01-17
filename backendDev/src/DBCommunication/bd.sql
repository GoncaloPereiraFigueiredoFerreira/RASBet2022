DROP DATABASE RASBET;
CREATE DATABASE IF NOT EXISTS RASBET;
USE RASBET;


CREATE TABLE IF NOT EXISTS Funcionario (
    Email VARCHAR(75) NOT NULL UNIQUE,
    PlvPasse VARCHAR(300) NOT NULL,
    FRole ENUM("Admin","Special"),
    PRIMARY KEY(Email)
);

CREATE TABLE IF NOT EXISTS Apostador (
    Email VARCHAR(75) NOT NULL UNIQUE,
    NIF VARCHAR(9) NOT NULL UNIQUE,
    Telemovel VARCHAR(9) NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    Morada VARCHAR(120) NOT NULL,
    DataNascimento DATE NOT NULL,
    Balance decimal(15,2) NOT NULL,
    PlvPasse VARCHAR(300) NOT NULL,
    CC VARCHAR(8) NOT NULL UNIQUE,
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
    Codigo VARCHAR(50),
    DateAp DATETIME NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY (ApostadorID)
        REFERENCES Apostador(Email)
);

CREATE TABLE IF NOT EXISTS Evento(
    ID VARCHAR(40) NOT NULL,
    Desporto VARCHAR(10) NOT NULL,
    Resultado INT NOT NULL,
    Descricao VARCHAR(255),
    Estado ENUM("BET","FIN","CLS") NOT NULL,
    Liga VARCHAR(50),
    DataEvent DATETIME NOT NULL,
    PRIMARY KEY(ID,Desporto)
);

CREATE TABLE IF NOT EXISTS Aposta_Evento(
	ApostaID INT NOT NULL,
    EventoID VARCHAR(40) NOT NULL,
    Desporto VARCHAR(10) NOT NULL,
    Escolha INT NOT NULL,
    PRIMARY KEY(ApostaID,EventoID,Desporto,Escolha),
    FOREIGN KEY(ApostaID)
		REFERENCES Aposta(ID),
    FOREIGN KEY(EventoID,Desporto)
		REFERENCES Evento(ID,Desporto)
);

CREATE TABLE IF NOT EXISTS RefreshTokens(
    Email VARCHAR(150) NOT NULL,
    URole VARCHAR(20) NOT NULL,
    Token VARCHAR(300) NOT NULL,
    PRIMARY KEY(Token)
);

INSERT INTO Funcionario(Email,PlvPasse,FRole) VALUES ("special@coisas.pt","$2b$10$2jKkxIjlvdNISUFt3MDcJOZsYx.I.YgbR6dfBF.nhKYmoCXc8bfyq","Special");
INSERT INTO Funcionario(Email,PlvPasse,FRole) VALUES ("admin@coisas.pt","$2b$10$WGqE.NFdUqjs3DqUixJmt.2ls6r/J5OwXHz2YKz7Ex/J5sxLQQbnu","Admin");
INSERT INTO Apostador(Email,NIF,Telemovel,Nome,Morada,DataNascimento,Balance,PlvPasse,CC) 
    VALUES ("user@coisas.pt","123456789","123456789","Couto dos Santos","ParaÃ­so","1999-9-7",2000,"$2b$10$FJSCi9UpkGKBoDmxmCp7lO0nNy6fM59MChbe0KysiSNLGEGgkafWa","12345678");