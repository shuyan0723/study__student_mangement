import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './App.css';
import AppRoutes from './routes';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <AppRoutes />
      </Router>
    </ConfigProvider>
  );
}

export default App;
