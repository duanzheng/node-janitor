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

    // Select directory
    const handleSelectDirectory = async () => {
        try {
            const path = await window.electronAPI.selectDirectory();
            if (path) {
                setSelectedPath(path);
            }
        } catch (error) {
            message.error('Failed to select directory');
        }
    };

    // Scan projects
    const handleScanProjects = async () => {
        if (!selectedPath) {
            message.warning('Please select a directory first');
            return;
        }

        setScanning(true);
        try {
            const result = await window.electronAPI.scanProjects(selectedPath);
            if (result.success && result.projects) {
                setProjects(result.projects);
                message.success(
                    `Scan completed, found ${result.projects.length} projects`
                );
            } else {
                message.error(`Scan failed: ${result.error}`);
            }
        } catch (error) {
            message.error('Scan failed');
        } finally {
            setScanning(false);
        }
    };

    // Delete node_modules
    const handleDeleteNodeModules = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select projects to clean');
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
                // Check specific project cleanup results
                const successfulDeletions =
                    result.results?.filter((r) => r.success).length || 0;
                const failedDeletions =
                    result.results?.filter((r) => !r.success).length || 0;

                // Update project status
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
                        `Cleanup successful! Freed ${formatFileSize(totalSize)} of space`
                    );
                } else {
                    message.warning(
                        `Partial cleanup successful: ${successfulDeletions} projects succeeded, ${failedDeletions} projects failed`
                    );
                }
            } else {
                message.error(`Cleanup failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Cleanup failed');
        } finally {
            setCleaning(false);
        }
    };

    // Table column configuration
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
            title: 'Project Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Project) => (
                <Space>
                    <Text strong>{text}</Text>
                    {!record.hasNodeModules && <Tag color="green">Cleaned</Tag>}
                </Space>
            ),
        },
        {
            title: 'node_modules Size',
            dataIndex: 'nodeModulesSize',
            key: 'nodeModulesSize',
            render: (size: number) => formatFileSize(size),
            sorter: (a: Project, b: Project) =>
                a.nodeModulesSize - b.nodeModulesSize,
        },
        {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
            render: (timestamp: number) => formatDate(timestamp),
            sorter: (a: Project, b: Project) => a.lastModified - b.lastModified,
            defaultSortOrder: 'ascend' as const,
        },
        {
            title: 'Full Path',
            dataIndex: 'path',
            key: 'path',
            ellipsis: true,
        },
    ];

    // Select all / Deselect all
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
                <Title level={3}>Project Cleaner</Title>
                <Text type="secondary">
                    Scan all Node.js projects in the specified directory,
                    analyze the size of their node_modules directories and
                    provide cleanup functionality
                </Text>

                <Space style={{ marginTop: '16px', marginBottom: '24px' }}>
                    <Input
                        value={selectedPath}
                        placeholder="Select root directory to scan"
                        style={{ width: '400px' }}
                        readOnly
                    />
                    <Button
                        icon={<FolderOpenOutlined />}
                        onClick={handleSelectDirectory}
                    >
                        Select Directory
                    </Button>
                    <Button
                        type="primary"
                        icon={<ScanOutlined />}
                        onClick={handleScanProjects}
                        loading={scanning}
                        disabled={!selectedPath}
                    >
                        Start Scan
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
                                Select All
                            </Checkbox>
                            <Text>
                                Selected {selectedProjects.length} projects,
                                estimated to free {formatFileSize(totalSize)} of
                                space
                            </Text>
                            <Popconfirm
                                title="Confirm Cleanup"
                                description={`About to delete node_modules directories from ${selectedProjects.length} projects, estimated to free ${formatFileSize(totalSize)} of space. This operation cannot be undone, continue?`}
                                onConfirm={handleDeleteNodeModules}
                                okText="Confirm Delete"
                                cancelText="Cancel"
                                disabled={selectedRowKeys.length === 0}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    loading={cleaning}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Clean Selected Projects
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
                            emptyText:
                                'No project data, please select a directory and scan first',
                        }}
                    />
                </Spin>
            </Card>
        </div>
    );
};

export default ProjectCleaner;
