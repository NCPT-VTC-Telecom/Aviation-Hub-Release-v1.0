import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

//import tailwind
import 'input.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

// fonts
import 'assets/fonts/inter/inter.css';

// scroll bar
import 'simplebar/dist/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// apex-chart
import 'assets/third-party/apex-chart.css';
import 'assets/third-party/react-table.css';

// project-imports
import App from './App';
import { store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';

const container = document.getElementById('root');
const root = createRoot(container!);
const clientID: string = process.env.REACT_APP_TOKEN_CLIENT_ID_GOOGLE || '';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
  <GoogleOAuthProvider clientId={clientID}>
    <ReduxProvider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ReduxProvider>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
