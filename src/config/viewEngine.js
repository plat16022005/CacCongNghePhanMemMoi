import express from 'express';

let configViewEngine = (app) => {
  app.use(express.static('./src/public')); // thư mục chứa file tĩnh
  app.set('view engine', 'ejs');
  app.set('views', './src/views');
};

module.exports = configViewEngine;
