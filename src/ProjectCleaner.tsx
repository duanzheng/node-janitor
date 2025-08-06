import React, { useState } from 'react';
import {
    Card,
    Button,
    Input,
    Table,
    Space,
    Spin,
    message,
    Popconfirm,
    Typography,
    Tag,
    Checkbox,
} from 'antd';
import {
    FolderOpenOutlined,
    ScanOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { formatFileSize, formatDate, calculateTotalSize } from './utils';
import { Project } from './types';

const { Title, Text } = Typography;

const ProjectCleaner: React.FC = () => {
    const [selectedPath, setSelectedPath] = useState<string>('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [scanning, setScanning] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [cleaning, setCleaning] = useState<boolean>(false);

    // 选择目录
    const handleSelectDirectory = async () => {
        try {
            const path = await window.electronAPI.selectDirectory();
            if (path) {
                setSelectedPath(path);
            }
        } catch (error) {
            message.error('选择目录失败');
        }
    };

    // 扫描项目
    const handleScanProjects = async () => {
        if (!selectedPath) {
            message.warning('请先选择目录');
            return;
        }

        setScanning(true);
        try {
            const result = await window.electronAPI.scanProjects(selectedPath);
            if (result.success && result.projects) {
                setProjects(result.projects);
                message.success(
                    `扫描完成，发现 ${result.projects.length} 个项目`
                );
            } else {
                message.error(`扫描失败: ${result.error}`);
            }
        } catch (error) {
            message.error('扫描失败');
        } finally {
            setScanning(false);
        }
    };

    // 删除node_modules
    const handleDeleteNodeModules = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请选择要清理的项目');
            return;
        }

        const selectedProjects = projects.filter((p) =>
            selectedRowKeys.includes(p.path)
        );
        const totalSize = calculateTotalSize(selectedProjects);

        setCleaning(true);
        try {
            const result =
                await window.electronAPI.deleteNodeModules(selectedRowKeys);

            if (result.success) {
                // 检查具体的项目清理结果
                const successfulDeletions =
                    result.results?.filter((r) => r.success).length || 0;
                const failedDeletions =
                    result.results?.filter((r) => !r.success).length || 0;

                // 更新项目状态
                const updatedProjects = projects.map((project) => {
                    if (selectedRowKeys.includes(project.path)) {
                        const operationResult = result.results?.find(
                            (r) => r.path === project.path
                        );
                        if (operationResult && operationResult.success) {
                            return {
                                ...project,
                                nodeModulesSize: 0,
                                hasNodeModules: false,
                            };
                        }
                    }
                    return project;
                });
                setProjects(updatedProjects);
                setSelectedRowKeys([]);

                if (failedDeletions === 0) {
                    message.success(
                        `清理成功！共释放 ${formatFileSize(totalSize)} 空间`
                    );
                } else {
                    message.warning(
                        `部分清理成功：${successfulDeletions} 个项目成功，${failedDeletions} 个项目失败`
                    );
                }
            } else {
                message.error(`清理失败: ${result.error}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error('清理失败');
        } finally {
            setCleaning(false);
        }
    };

    // 表格列配置
    const columns = [
        {
            title: '',
            dataIndex: 'path',
            key: 'select',
            width: 50,
            render: (text: string, record: Project) => (
                <Checkbox
                    checked={selectedRowKeys.includes(text)}
                    onChange={() => {
                        const newSelectedKeys = selectedRowKeys.includes(text)
                            ? selectedRowKeys.filter((key) => key !== text)
                            : [...selectedRowKeys, text];
                        setSelectedRowKeys(newSelectedKeys);
                    }}
                    disabled={!record.hasNodeModules}
                />
            ),
        },
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Project) => (
                <Space>
                    <Text strong>{text}</Text>
                    {!record.hasNodeModules && <Tag color="green">已清理</Tag>}
                </Space>
            ),
        },
        {
            title: 'node_modules 大小',
            dataIndex: 'nodeModulesSize',
            key: 'nodeModulesSize',
            render: (size: number) => formatFileSize(size),
            sorter: (a: Project, b: Project) =>
                a.nodeModulesSize - b.nodeModulesSize,
        },
        {
            title: '最近修改时间',
            dataIndex: 'lastModified',
            key: 'lastModified',
            render: (timestamp: number) => formatDate(timestamp),
            sorter: (a: Project, b: Project) => a.lastModified - b.lastModified,
            defaultSortOrder: 'ascend' as const,
        },
        {
            title: '完整路径',
            dataIndex: 'path',
            key: 'path',
            ellipsis: true,
        },
    ];

    // 全选/取消全选
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const selectableProjects = projects.filter((p) => p.hasNodeModules);
            setSelectedRowKeys(selectableProjects.map((p) => p.path));
        } else {
            setSelectedRowKeys([]);
        }
    };

    const selectedProjects = projects.filter((p) =>
        selectedRowKeys.includes(p.path)
    );
    const totalSize = calculateTotalSize(selectedProjects);

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Title level={3}>项目清理</Title>
                <Text type="secondary">
                    扫描指定目录下所有的 Node.js 项目，分析其 node_modules
                    目录的大小并提供清理功能
                </Text>

                <Space style={{ marginTop: '16px', marginBottom: '24px' }}>
                    <Input
                        value={selectedPath}
                        placeholder="选择要扫描的根目录"
                        style={{ width: '400px' }}
                        readOnly
                    />
                    <Button
                        icon={<FolderOpenOutlined />}
                        onClick={handleSelectDirectory}
                    >
                        选择目录
                    </Button>
                    <Button
                        type="primary"
                        icon={<ScanOutlined />}
                        onClick={handleScanProjects}
                        loading={scanning}
                        disabled={!selectedPath}
                    >
                        开始扫描
                    </Button>
                </Space>

                {projects.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <Space>
                            <Checkbox
                                checked={
                                    selectedRowKeys.length ===
                                    projects.filter((p) => p.hasNodeModules)
                                        .length
                                }
                                indeterminate={
                                    selectedRowKeys.length > 0 &&
                                    selectedRowKeys.length <
                                        projects.filter((p) => p.hasNodeModules)
                                            .length
                                }
                                onChange={(e) =>
                                    handleSelectAll(e.target.checked)
                                }
                            >
                                全选
                            </Checkbox>
                            <Text>
                                已选择 {selectedProjects.length}{' '}
                                个项目，预计可释放 {formatFileSize(totalSize)}{' '}
                                空间
                            </Text>
                            <Popconfirm
                                title="确认清理"
                                description={`即将删除 ${selectedProjects.length} 个项目中的 node_modules 目录，预计释放 ${formatFileSize(totalSize)} 空间。此操作不可撤销，是否继续？`}
                                onConfirm={handleDeleteNodeModules}
                                okText="确认删除"
                                cancelText="取消"
                                disabled={selectedRowKeys.length === 0}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    loading={cleaning}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    清理选中项目
                                </Button>
                            </Popconfirm>
                        </Space>
                    </div>
                )}

                <Spin spinning={scanning}>
                    <Table
                        columns={columns}
                        dataSource={projects}
                        rowKey="path"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800 }}
                        locale={{
                            emptyText: '暂无项目数据，请先选择目录并扫描',
                        }}
                    />
                </Spin>
            </Card>
        </div>
    );
};

export default ProjectCleaner;
