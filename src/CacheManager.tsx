import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Space,
  Spin,
  message,
  Popconfirm,
  Typography,
  Tag,
  Alert,
} from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatFileSize, getPackageManagerIcon } from './utils';
import { Cache } from './types';

const { Title, Text } = Typography;

const CacheManager: React.FC = () => {
  const [caches, setCaches] = useState<Cache[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cleaning, setCleaning] = useState<{ [key: string]: boolean }>({});

  // Detect caches
  const handleDetectCaches = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.detectCaches();
      if (result.success && result.caches) {
        setCaches(result.caches);
      } else {
        message.error(`Detection failed: ${result.error}`);
      }
    } catch {
      message.error('Detection failed');
    } finally {
      setLoading(false);
    }
  };

  // Clean cache
  const handleCleanCache = async (packageManager: string) => {
    const cache = caches.find((c) => c.name === packageManager);
    if (!cache || !cache.detected) {
      return;
    }

    setCleaning((prev) => ({ ...prev, [packageManager]: true }));
    try {
      const result = await window.electronAPI.cleanCache(packageManager);

      if (result.success) {
        // Update state directly, don't re-detect
        setCaches((prevCaches) =>
          prevCaches.map((c) => (c.name === packageManager ? { ...c, size: 0 } : c)),
        );
        message.success(`${packageManager.toUpperCase()} cache cleaned successfully`);
      } else {
        message.error(`Cleanup failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Clean cache error:', error);
      message.error('Cleanup failed');
    } finally {
      setCleaning((prev) => ({ ...prev, [packageManager]: false }));
    }
  };

  // Auto-detect caches when component loads
  useEffect(() => {
    handleDetectCaches();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>Cache Manager</Title>
        <Text type="secondary">
          Automatically detect and display cache sizes for mainstream package managers, and provide
          one-click cleanup functionality
        </Text>

        <div style={{ marginTop: '16px', marginBottom: '24px' }}>
          <Button icon={<ReloadOutlined />} onClick={handleDetectCaches} loading={loading}>
            Re-detect
          </Button>
        </div>

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {caches.map((cache) => (
              <Col xs={24} sm={12} lg={8} key={cache.name}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 0,
                    }}
                  >
                    <Space
                      direction="vertical"
                      style={{
                        width: '100%',
                        flex: '1 1 auto',
                      }}
                    >
                      <Space>
                        <Text strong style={{ fontSize: '18px' }}>
                          {getPackageManagerIcon(cache.name)} {cache.name.toUpperCase()}
                        </Text>
                        {cache.detected ? (
                          <Tag color="green">Detected</Tag>
                        ) : (
                          <Tag color="red">Not Detected</Tag>
                        )}
                      </Space>

                      {cache.detected ? (
                        <>
                          <Text type="secondary">
                            Cache Size: <Text strong>{formatFileSize(cache.size)}</Text>
                          </Text>
                          <div
                            style={{
                              fontSize: '12px',
                              wordBreak: 'break-all',
                              overflow: 'hidden',
                              height: '40px',
                              lineHeight: '20px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              type="secondary"
                              ellipsis={{
                                tooltip: cache.path,
                              }}
                            >
                              Path: {cache.path}
                            </Text>
                          </div>
                        </>
                      ) : (
                        <Alert
                          message="Package manager not detected"
                          description={
                            cache.error || 'Please ensure the package manager is installed'
                          }
                          type="warning"
                          showIcon
                        />
                      )}
                    </Space>
                  </div>

                  <div
                    style={{
                      marginTop: '16px',
                      textAlign: 'center',
                      flex: '0 0 auto',
                    }}
                  >
                    {!cache.detected || cache.size === 0 ? (
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={true}
                        style={{ width: '100%' }}
                      >
                        Clean Cache
                      </Button>
                    ) : (
                      <Popconfirm
                        title="Confirm Cleanup"
                        description={`About to clean ${cache.name.toUpperCase()} cache, estimated to free ${formatFileSize(cache.size)} of space. This operation cannot be undone, continue?`}
                        onConfirm={() => handleCleanCache(cache.name)}
                        okText="Confirm Cleanup"
                        cancelText="Cancel"
                      >
                        <Button
                          type="primary"
                          danger
                          icon={<DeleteOutlined />}
                          loading={cleaning[cache.name]}
                          style={{ width: '100%' }}
                        >
                          Clean Cache
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </Card>
    </div>
  );
};

export default CacheManager;
