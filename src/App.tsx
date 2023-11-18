import { Home } from "./Home";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Topup } from "./Topup";
import { GlobalProvider } from "./GlobalState";
import { SendOnChain } from "./SendOnChain";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/topup"
            element={<Topup />}
          />
          <Route
            path="/sendOnChain"
            element={<SendOnChain />}
          />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
