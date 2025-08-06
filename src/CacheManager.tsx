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
import {
    DeleteOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { formatFileSize, getPackageManagerIcon } from './utils';
import { Cache } from './types';

const { Title, Text } = Typography;

const CacheManager: React.FC = () => {
    const [caches, setCaches] = useState<Cache[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [cleaning, setCleaning] = useState<{ [key: string]: boolean }>({});

    // 检测缓存
    const handleDetectCaches = async () => {
        setLoading(true);
        try {
            const result = await window.electronAPI.detectCaches();
            if (result.success && result.caches) {
                setCaches(result.caches);
            } else {
                message.error(`检测失败: ${result.error}`);
            }
        } catch (error) {
            message.error('检测失败');
        } finally {
            setLoading(false);
        }
    };

    // 清理缓存
    const handleCleanCache = async (packageManager: string) => {
        console.log('Cleaning cache for:', packageManager);
        const cache = caches.find((c) => c.name === packageManager);
        if (!cache || !cache.detected) {
            console.log('Cache not found or not detected');
            return;
        }

        setCleaning((prev) => ({ ...prev, [packageManager]: true }));
        try {
            const result = await window.electronAPI.cleanCache(packageManager);
            console.log('Clean cache result:', result);

            if (result.success) {
                // 更新缓存状态
                setCaches((prevCaches) =>
                    prevCaches.map((cache) =>
                        cache.name === packageManager
                            ? { ...cache, size: 0 }
                            : cache
                    )
                );
                message.success(`${packageManager.toUpperCase()} 缓存清理成功`);
            } else {
                message.error(`清理失败: ${result.message}`);
            }
        } catch (error) {
            console.error('Clean cache error:', error);
            message.error('清理失败');
        } finally {
            setCleaning((prev) => ({ ...prev, [packageManager]: false }));
        }
    };

    // 组件加载时自动检测缓存
    useEffect(() => {
        handleDetectCaches();
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Title level={3}>缓存管理</Title>
                <Text type="secondary">
                    自动检测并显示主流包管理器的缓存大小，并提供一键清理功能
                </Text>

                <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleDetectCaches}
                        loading={loading}
                    >
                        重新检测
                    </Button>
                </div>

                <Spin spinning={loading}>
                    <Row gutter={[16, 16]}>
                        {caches.map((cache) => (
                            <Col xs={24} sm={12} lg={8} key={cache.name}>
                                <Card hoverable>
                                    <Space
                                        direction="vertical"
                                        style={{ width: '100%' }}
                                    >
                                        <Space>
                                            <Text
                                                strong
                                                style={{ fontSize: '18px' }}
                                            >
                                                {getPackageManagerIcon(
                                                    cache.name
                                                )}{' '}
                                                {cache.name.toUpperCase()}
                                            </Text>
                                            {cache.detected ? (
                                                <Tag color="green">已检测</Tag>
                                            ) : (
                                                <Tag color="red">未检测</Tag>
                                            )}
                                        </Space>

                                        {cache.detected ? (
                                            <>
                                                <Text type="secondary">
                                                    缓存大小:{' '}
                                                    <Text strong>
                                                        {formatFileSize(
                                                            cache.size
                                                        )}
                                                    </Text>
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: '12px' }}
                                                >
                                                    路径: {cache.path}
                                                </Text>
                                            </>
                                        ) : (
                                            <Alert
                                                message="未检测到该包管理器"
                                                description={
                                                    cache.error ||
                                                    '请确保已安装该包管理器'
                                                }
                                                type="warning"
                                                showIcon
                                            />
                                        )}
                                    </Space>

                                    <div
                                        style={{
                                            marginTop: '16px',
                                            textAlign: 'center',
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
                                                清理缓存
                                            </Button>
                                        ) : (
                                            <Popconfirm
                                                title="确认清理"
                                                description={`即将清理 ${cache.name.toUpperCase()} 的缓存，预计释放 ${formatFileSize(cache.size)} 空间。此操作不可撤销，是否继续？`}
                                                onConfirm={() =>
                                                    handleCleanCache(cache.name)
                                                }
                                                okText="确认清理"
                                                cancelText="取消"
                                            >
                                                <Button
                                                    type="primary"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    loading={
                                                        cleaning[cache.name]
                                                    }
                                                    style={{ width: '100%' }}
                                                >
                                                    清理缓存
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
