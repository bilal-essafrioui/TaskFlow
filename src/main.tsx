import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
