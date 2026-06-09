const BASE_URL = 'http://localhost:3000/api';

let token = '';

// 初始化 token
function initToken() {
  token = wx.getStorageSync('token') || '';
}

// 请求函数
function request({
  url,
  method = 'GET',
  data = null,
  header = {},
  ...rest
}) {
  return new Promise((resolve, reject) => {
    const requestHeader = {
      'Content-Type': 'application/json',
      ...header,
    };

    if (token) {
      requestHeader.Authorization = `Bearer ${token}`;
    }

    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: requestHeader,
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token 过期，清空 token 并跳转登录
          wx.removeStorageSync('token');
          token = '';
          wx.navigateTo({ url: '/pages/auth/login' });
          reject(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: reject,
      ...rest,
    });
  });
}

// 登录函数
function login(phone, password) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: { phone, password },
  }).then((res) => {
    if (res.data && res.data.token) {
      token = res.data.token;
      wx.setStorageSync('token', token);
    }
    return res;
  });
}

// 设置 token
function setToken(newToken) {
  token = newToken;
  wx.setStorageSync('token', token);
}

// 清空 token
function clearToken() {
  token = '';
  wx.removeStorageSync('token');
}

module.exports = {
  request,
  login,
  setToken,
  clearToken,
  initToken,
};
