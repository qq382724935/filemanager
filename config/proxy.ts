/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:48:37
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 02:52:19
 * @Description:
 * @PageName:
 */

export default {
  dev: {
    '/api': {
      target: 'http://106.55.0.193:8010/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
