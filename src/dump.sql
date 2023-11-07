create database dindin;

create table usuarios(
	id serial primary key  not null,
	nome varchar(100) not null,
	email varchar(150) not null unique,
	senha varchar(100) not null 
);

create table categorias(
	id serial primary key not null,
	descricao varchar(100) not null unique
);

create type tipo_transacao as enum ('entrada', 'saida');

create table transacoes(
	id serial primary key not null,
	descricao varchar(50) not null,
	valor int not null,
	data date not null,
	categoria_id int not null,
	usuario_id int not null,
	tipo tipo_transacao
);

alter table transacoes add constraint FK_CATEGORIAS_TRANSACOES
foreign key(categoria_id) references categorias(id);

alter table transacoes add constraint FK_USUARIOS_TRANSACOES
foreign key(usuario_id) references usuarios(id);

insert into categorias (descricao) 
values ('Alimentação'),
 ('Assinaturas e Serviços'),
 ('Casa'),
 ('Mercado'),
 ('Cuidados Pessoais'),
 ('Educação'),
 ('Familia'),
 ('Lazer'),
 ('Petz'),
 ('Presentes'),
 ('Roupas'),
 ('Saúde'),
 ('Transporte'),
 ('Salário'),
 ('Vendas'),
 ('Outras receitas'),
 ('Outras despesas');
