
import { Button, Result, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Space size="middle">
            {/* <Button type="primary" icon={<HomeOutlined />} onClick={handleGoHome}>
              返回首页
            </Button> */}
            <Button type="primary" onClick={handleGoLogin}>
              返回登录页面
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default NotFoundPage;