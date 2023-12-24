/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:14:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 18:29:39
 * @Description: 
 * @PageName: 
 */
import { Layout, Row, Typography } from 'antd';
import React from 'react';
import styles from './Guide.less';

// 脚手架示例组件
const Guide: React.FC = () => {
  return (
    <Layout>
      <Row>
        <Typography.Title level={3} className={styles.title}>
          欢迎使用 ！
        </Typography.Title>
      </Row>
    </Layout>
  );
};

export default Guide;
