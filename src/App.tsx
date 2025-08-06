import React from 'react';
import { Layout, Typography, Button } from 'antd';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 50px' }}>
        <Title level={3} style={{ color: 'white', margin: '16px 0' }}>
          Electron + TypeScript + Ant Design
        </Title>
      </Header>
      <Content style={{ padding: '50px' }}>
        <Title>Welcome to Your App!</Title>
        <Paragraph>
          This is a basic Electron application with TypeScript and Ant Design.
        </Paragraph>
        <Button type="primary" size="large">
          Get Started
        </Button>
      </Content>
    </Layout>
  );
};

export default App;