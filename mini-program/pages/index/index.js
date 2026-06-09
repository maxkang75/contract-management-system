const { request, initToken } = require('../../utils/request');

Page({
  data: {
    summary: {
      active_contracts: 0,
      in_progress_projects: 0,
      receivable: 0,
      payable: 0,
    },
  },

  onLoad() {
    initToken();
    this.loadSummary();
  },

  onShow() {
    this.loadSummary();
  },

  async loadSummary() {
    try {
      const res = await request({
        url: '/dashboard/summary',
        method: 'GET',
      });
      if (res.code === 200) {
        this.setData({ summary: res.data });
      }
    } catch (error) {
      console.error('Failed to load summary:', error);
    }
  },
});
