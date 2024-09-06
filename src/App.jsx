import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Nav } from "./components/Navbar";
import Auth from "./pages/Auth";
import { AuthProvider } from "./lib/AuthContext";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import PrivateRoute from "./lib/PrivateRoute";
import PropertyDetails from "./pages/PropertyDetails";
import PropertiesPage from "./pages/PropertiesPage";
import MyAppointments from "./pages/MyAppointments";
import MyProperties from "./pages/MyProperties";
import BookerQueries from "./pages/BookerQueries";

export default function App() {
  return <>
    <AuthProvider>
  <Nav/>
  <Routes>
    <Route element={<Home/>} path="/"/>
    <Route element={<Auth/>} path="/auth"/>
    <Route element={<PropertiesPage/>} path="/properties"/>
   <Route element={<PrivateRoute/>}>
   <Route element={<AddProperty/>} path="/add-proprty"/>
   <Route element={<MyAppointments/>} path="/myappointments"/>
   <Route element={<MyProperties/>} path="/myproperties"/>
   <Route element={<BookerQueries/>} path="/queries"/>
    <Route element={<EditProperty/>} path="/edit-proprty/:pid"/>
    <Route element={<PropertyDetails/>} path="/propertinfo/:pid"/>
   </Route>
  </Routes>
    </AuthProvider>
  </>
}