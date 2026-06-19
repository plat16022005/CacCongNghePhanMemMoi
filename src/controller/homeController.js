import User from '../models/user';
import CRUDService from '../services/CRUDService';

import jwt from "jsonwebtoken";

// Trang chủ
let getHomePage = async (req, res) => {
  try {
    let user = null;
    if (req.cookies && req.cookies.accessToken) {
      try {
        user = jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {}
    }
    
    return res.render('homepage.ejs', { user: user });
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
