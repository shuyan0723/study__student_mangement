import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
// import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';
import AppRoutes from './routes';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#d9363e',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: '#d9363e',
          borderRadius: 6,
        },
        components: {
          Button: {
            colorPrimary: '#d9363e',
            colorPrimaryHover: '#ff4d4f',
          },
          Menu: {
            colorItemBgSelected: '#fff1f0',
            colorItemTextSelected: '#d9363e',
          },
          Card: {
            colorPrimary: '#d9363e',
          },
        },
      }}
    >
      <Router>
        <AppRoutes />
        {/* <SpeedInsights /> */}
      </Router>
    </ConfigProvider>
  );
}

export default App;
