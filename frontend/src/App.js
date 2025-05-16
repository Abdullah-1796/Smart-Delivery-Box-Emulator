import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Locker from "./components/Locker";
import LockerList from "./components/LockerList";
import OpenCompartment from "./components/OpenCompartment";
import LockerSimulator from "./components/LockerSimulator";
import FullDoor from "./components/FullDoor";

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<LockerList />} />
				<Route exact path="/Locker/:id" element={<Locker />} />
				<Route exact path="/OpenCompartment" element={<OpenCompartment />} />
				<Route path="*" element={<Navigate to="/" />} />
				{/* <Route exact path="/LockerSimulator" element={<LockerSimulator />} /> */}
				<Route exact path="/FullDoor" element={<FullDoor />} />

			</Routes>
		</Router>
	);
}

export default App;