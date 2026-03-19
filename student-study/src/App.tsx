import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
// import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';
import AppRoutes from './routes';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <AppRoutes />
        {/* <SpeedInsights /> */}
      </Router>
    </ConfigProvider>
  );
}

export default App;
