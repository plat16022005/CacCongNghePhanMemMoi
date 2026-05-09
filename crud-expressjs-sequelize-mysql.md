# Hướng dẫn CRUD với Express.js – Sequelize – MySQL

---

## Bước 1: Khởi tạo dự án

Cài đặt Node.js (phiên bản >18) và MySQL. Sau đó tạo file `package.json`:

```bash
npm init
```

---

## Bước 2: Cài đặt các thư viện cần thiết

```bash
npm install --save express body-parser dotenv ejs sequelize

npm install --save-dev @babel/core @babel/node @babel/preset-env nodemon
```

Cấu hình `package.json` thêm script start:

```json
"scripts": {
  "start": "nodemon --exec babel-node src/server.js"
}
```

---

## Bước 3: Cài đặt MySQL driver và Sequelize CLI, khởi tạo cấu trúc Sequelize

```bash
npm install --save mysql2
npm install --save-dev sequelize-cli
node_modules/.bin/sequelize init
```

Tạo các file cấu hình sau ở thư mục gốc:

**`.babelrc`**
```json
{
  "presets": ["@babel/preset-env"]
}
```

**`.env`**
```
PORT=8088
NODE_ENV=development
```

**`.env.example`**
```
PORT=
```

**`.gitignore`**
```
/node_modules
/vendor
/.idea
.idea/
.env
package-lock.json
```

**`.sequelizerc`** (trỏ đường dẫn đúng vào thư mục `src`):
```js
const path = require('path');
module.exports = {
  'config': path.resolve('./src/config', 'config.json'),
  'migrations-path': path.resolve('./src', 'migrations'),
  'models-path': path.resolve('./src', 'models'),
  'seeders-path': path.resolve('./src', 'seeders')
};
```

---

## Bước 4: Tạo thư mục `src/config` và các file cấu hình

**`src/config/config.json`** – cấu hình kết nối database:
```json
{
  "development": {
    "username": "root",
    "password": "1234567@a$",
    "database": "node_fulltask",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

**`src/config/configdb.js`** – kết nối Sequelize:
```js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('node_fulltask', 'root', '1234567@a$', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = connectDB;
```

**`src/config/viewEngine.js`** – cấu hình view engine EJS:
```js
import express from 'express';

let configViewEngine = (app) => {
  app.use(express.static('./src/public')); // thư mục chứa file tĩnh
  app.set('view engine', 'ejs');
  app.set('views', './src/views');
};

module.exports = configViewEngine;
```

---

## Bước 5: Tạo file `src/server.js`

```js
import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/configdb';

require('dotenv').config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRoutes(app);
connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log('Backend Nodejs is running on the port: ' + port);
});
```

Cấu trúc thư mục `src` cần có:
```
src/
├── config/
├── controller/
├── migrations/
├── models/
├── public/
├── route/
├── seeders/
├── services/
├── views/
└── server.js
```

---

## Bước 6: Tạo file `src/route/web.js`

```js
import express from 'express';
import homeController from '../controller/homeController';

let router = express.Router();

let initWebRoutes = (app) => {
  router.get('/', (req, res) => {
    return res.send('Nguyễn Hữu Trung');
  });

  router.get('/home', homeController.getHomePage);
  router.get('/about', homeController.getAboutPage);
  router.get('/crud', homeController.getCRUD);
  router.post('/post-crud', homeController.postCRUD);
  router.get('/get-crud', homeController.getFindAllCrud);
  router.get('/edit-crud', homeController.getEditCRUD);
  router.post('/put-crud', homeController.putCRUD);
  router.get('/delete-crud', homeController.deleteCRUD);

  return app.use('/', router);
};

module.exports = initWebRoutes;
```

---

## Bước 7: Tạo Model và Migration

**`src/models/user.js`**
```js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // định nghĩa mối quan hệ
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
```

**`src/migrations/migration-create-user.js`** – tạo bảng `users`:
```js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      email: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      phoneNumber: { type: Sequelize.STRING },
      gender: { type: Sequelize.BOOLEAN },
      image: { type: Sequelize.STRING },
      roleId: { type: Sequelize.STRING },
      positionId: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
```

Chạy migration để tạo bảng trong database:
```bash
npx sequelize-cli db:migrate
```

---

## Bước 8: Tạo file `src/services/CRUDService.js`

```js
import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

// Tạo user mới
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === '1' ? true : false,
        roleId: data.roleId
      });
      resolve('OK create a new user successfull');
    } catch (e) {
      reject(e);
    }
  });
};

// Hash password
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync('B4c0/\/', salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy tất cả user (findAll)
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({ raw: true });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy 1 user theo id (findOne)
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true
      });
      if (user) resolve(user);
      else resolve([]);
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật user (update)
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: data.id } });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        let allusers = await db.User.findAll();
        resolve(allusers);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa user
let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId } });
      if (user) {
        user.destroy();
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById
};
```

---

## Bước 9: Tạo file `src/controller/homeController.js`

```js
import db from '../models/index';
import CRUDService from '../services/CRUDService';

// Trang chủ
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render('homepage.ejs', { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

// Trang about
let getAboutPage = (req, res) => {
  return res.render('test/about.ejs');
};

// Hiển thị form tạo user
let getCRUD = (req, res) => {
  return res.render('crud.ejs');
};

// Lấy danh sách tất cả user
let getFindAllCrud = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render('users/findAllUser.ejs', { datalist: data });
};

// Tạo user mới từ form
let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send('Post crud to server');
};

// Lấy dữ liệu user để edit
let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);
    return res.render('users/editUser.ejs', { data: userData });
  } else {
    return res.send('không lấy được id');
  }
};

// Cập nhật user
let putCRUD = async (req, res) => {
  let data = req.body;
  let data1 = await CRUDService.updateUser(data);
  return res.render('users/findAllUser.ejs', { datalist: data1 });
};

// Xóa user
let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send('Deleted!!!!!!!!!!!!');
  } else {
    return res.send('Not find user');
  }
};

module.exports = {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  getFindAllCrud,
  getEditCRUD,
  putCRUD,
  deleteCRUD
};
```

---

## Bước 10: Tạo các file View (EJS)

**`src/views/crud.ejs`** – Form tạo user mới:
```html
<form action="/post-crud" method="post">
  <div class="form-row">
    <div class="form-group col-md-6">
      <label>Email</label>
      <input type="email" class="form-control" name="email">
    </div>
    <div class="form-group col-md-6">
      <label>Password</label>
      <input type="password" class="form-control" name="password">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
      <label>First Name</label>
      <input type="text" class="form-control" name="firstName">
    </div>
    <div class="form-group col-md-6">
      <label>Last Name</label>
      <input type="text" class="form-control" name="lastName">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-md-4">
      <label>Phone Number</label>
      <input type="text" class="form-control" name="phoneNumber">
    </div>
    <div class="form-group col-md-4">
      <label>Gender</label>
      <select name="gender" class="form-control">
        <option selected value="0">Male</option>
        <option value="1">Female</option>
      </select>
    </div>
    <div class="form-group col-md-4">
      <label>Role</label>
      <select name="roleId" class="form-control">
        <option selected value="1">Admin</option>
        <option value="2">Doctor</option>
        <option value="3">Patient</option>
      </select>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">Sign in</button>
</form>
```

**`src/views/users/findAllUser.ejs`** – Danh sách user:
```html
<body>
  <table style="width:100%">
    <tr>
      <th>Email</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Address</th>
      <th>Action</th>
    </tr>
    <% for(let i=0; i < datalist.length; i++) { %>
    <tr>
      <td><%= datalist[i].email %></td>
      <td><%= datalist[i].firstName %></td>
      <td><%= datalist[i].lastName %></td>
      <td><%= datalist[i].address %></td>
      <td>
        <a href="/edit-crud?id=<%= datalist[i].id %>">Edit</a> ||
        <a href="/delete-crud?id=<%= datalist[i].id %>">Delete</a>
      </td>
    </tr>
    <% } %>
  </table>
</body>
```

**`src/views/users/editUser.ejs`** – Form cập nhật user:
```html
<div class="container">
  <div class="row">
    <form action="/put-crud" method="post">
      <input type="text" class="form-control" name="id" value="<%=data.id%>">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>First Name</label>
          <input type="text" class="form-control" name="firstName" value="<%=data.firstName%>">
        </div>
        <div class="form-group col-md-6">
          <label>Last Name</label>
          <input type="text" class="form-control" name="lastName" value="<%=data.lastName%>">
        </div>
      </div>
      <div class="form-group">
        <label>Address</label>
        <input type="text" class="form-control" name="address" value="<%=data.address%>">
      </div>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</div>
```

---

## Bước 11: Chạy dự án

```bash
npm start
```

Truy cập các URL sau để kiểm tra:

| URL | Chức năng |
|---|---|
| `localhost:8088/crud` | Form tạo user mới |
| `localhost:8088/get-crud` | Danh sách tất cả user |
| `localhost:8088/edit-crud?id=1` | Form chỉnh sửa user |
| `localhost:8088/delete-crud?id=1` | Xóa user |

---

## Bài tập về nhà

Thực hiện các bước tương tự nhưng thay MySQL + Sequelize bằng **MongoDB + Mongoose**.
