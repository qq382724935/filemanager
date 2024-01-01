/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:48:37
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-31 14:55:58
 * @Description: 
 * @PageName: 
 */
import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '十一初臻彩共享平台',
  pwa: true,
  logo: 'https://ecrcphototest.upbuy.com.cn/emm/portal/packages/1703273444728.png',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
};

export default Settings;
