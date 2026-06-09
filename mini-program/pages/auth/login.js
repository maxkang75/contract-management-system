const { login } = require('../../utils/request');

Page({
  data: {
    phone: '13800138000',
    password: '123456',
    loading: false,
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  async onLogin() {
    const { phone, password } = this.data;

    if (!phone || !password) {
      wx.showToast({
        title: '请输入手机号和密码',
        icon: 'none',
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const res = await login(phone, password);
      wx.showToast({
        title: '登录成功',
        icon: 'success',
      });
      wx.navigateTo({ url: '/pages/index/index' });
    } catch (error) {
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },
});
