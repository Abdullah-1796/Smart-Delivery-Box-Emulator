import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Locker from "./components/Locker";
import LockerList from "./components/LockerList";
import OpenCompartment from "./components/OpenCompartment";

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<LockerList />} />
				<Route exact path="/Locker/:id" element={<Locker />} />
				<Route exact path="/OpenCompartment" element={<OpenCompartment />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
}

export default App;