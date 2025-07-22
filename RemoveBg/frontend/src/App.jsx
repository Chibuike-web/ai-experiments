import "./globals.css";
import Multiple from "./pages/Multiple";
import Single from "./pages/Single";
import { BrowserRouter as Router, Routes, Route } from "react-router";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Single />} />
				<Route path="/mutiple" element={<Multiple />} />
			</Routes>
		</Router>
	);
}
