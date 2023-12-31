/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:48:37
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-31 08:19:42
 * @Description:
 * @PageName:
 */

export default {
  dev: {
    '/api': {
      // target: 'http://106.55.0.193:8010/',
      target: 'http://192.168.1.4:8081/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
