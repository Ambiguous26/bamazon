DROP DATABASE IF EXISTS bamazon_db;
create database bamazon_db;
use bamazon_db;

create table products(
	itemid integer auto_increment not null,
    productname varchar(50) not null,
    departmentname varchar(50) not null,
    price decimal(10,4) not null,
    stockquantity integer(10) not null,
    primary key (id)
    
);