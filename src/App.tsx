import React, { useState } from 'react';
import { Layout, Menu, Typography, theme } from 'antd';
import { 
  ClearOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons';
import ProjectCleaner from './ProjectCleaner';
import CacheManager from './CacheManager';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

import './types';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('projects');
  const [totalSaved, setTotalSaved] = useState(0);
  const [status, setStatus] = useState('空闲');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'projects',
      icon: <ClearOutlined />,
      label: '项目清理',
    },
    {
      key: 'cache',
      icon: <DeleteOutlined />,
      label: '缓存管理',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'projects':
        return <ProjectCleaner />;
      case 'cache':
        return <CacheManager />;
      default:
        return <ProjectCleaner />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ background: '#001529' }}
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'NJ' : 'Node Janitor'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Title level={3} style={{ margin: 0 }}>
            Node Janitor - {menuItems.find(item => item.key === selectedKey)?.label}
          </Title>
          <InfoCircleOutlined style={{ fontSize: '20px', color: '#666' }} />
        </Header>
        <Content style={{ 
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          overflow: 'auto'
        }}>
          {renderContent()}
        </Content>
        <Footer style={{ 
          textAlign: 'center',
          background: colorBgContainer,
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>状态: {status}</span>
            <span>已节省空间: {totalSaved > 0 ? `${(totalSaved / 1024 / 1024 / 1024).toFixed(2)} GB` : '0 GB'}</span>
            <span>Node Janitor ©2024</span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;