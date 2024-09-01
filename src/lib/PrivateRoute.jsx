import {Outlet,Navigate} from 'react-router-dom'
import { useAuth} from "./useAuth";

const PrivateRoute = () => {
    const {user} = useAuth()
  return (
    <>
    {user ? <Outlet/> : <Navigate to='/auth'/>}
    </>
  )
}

export default PrivateRoute