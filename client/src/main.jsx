import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { persistor, store } from './redux/storage'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async';
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router,  } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <HelmetProvider>
  <Provider store={store}>
          <PersistGate persistor={persistor}>

         
    <Router>
      <Toaster position="bottom-right"
  reverseOrder={false}/>
  
    <App />
    </Router>
    </PersistGate>
    </Provider>
    </HelmetProvider>
  // </StrictMode>,
)
