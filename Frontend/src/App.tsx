// project-imports
import Routes from 'routes';
import ThemeCustomization from 'themes';
// import Loader from 'components/Loader';
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import DevToolsDetector from 'components/DevToolsDetector';
// import ErrorBoundary from 'pages/maintenance/ErrorBoundary';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  // const [loading, setLoading] = useState<boolean>(true);

  // if (loading) return <Loader />;

  return (
    <>
      {/* <ErrorBoundary> */}
      <DevToolsDetector />
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <ScrollTop>
              <AuthProvider>
                <>
                  <Notistack>
                    <Routes />
                    <Snackbar />
                  </Notistack>
                </>
              </AuthProvider>
            </ScrollTop>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
      {/* </ErrorBoundary> */}
    </>
  );
};

window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});
export default App;
