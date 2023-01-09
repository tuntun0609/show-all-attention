import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import zhCN from '@locale/zh_CN';
import './reset.css';

dayjs.locale('zh-cn');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#fb7299',
				},
			}}
			locale={zhCN}
		>
      <App></App>
		</ConfigProvider>
	</React.StrictMode>,
);
