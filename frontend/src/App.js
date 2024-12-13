import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Locker from "./components/Locker";
import LockerList from "./components/LockerList";

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<LockerList />} />
				<Route exact path="/Locker/:id" element={<Locker />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
}

export default App;