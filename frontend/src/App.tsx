import { Provider } from 'react-redux';
import AppRouter from './routes/AppRouter';
import { persistor, store } from './lib/features/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
          </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;