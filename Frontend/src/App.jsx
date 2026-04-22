import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";
import {authProvider} from "./features/auth/auth.context.jsx"
export default function App() {
  return (
    <BrowserRouter>
      <authProvider>
          <AppRoutes />
      </authProvider>
    </BrowserRouter>
  );
}
