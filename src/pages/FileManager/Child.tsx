/*
 * @Author: 刘利军
 * @Date: 2023-12-25 00:29:56
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-25 08:08:08
 * @Description: 
 * @PageName: 
 */
import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';

const Child = () => {
  return <Result icon={<SmileOutlined />} title="暂无可查看的数据!" />;
};

export default Child;
