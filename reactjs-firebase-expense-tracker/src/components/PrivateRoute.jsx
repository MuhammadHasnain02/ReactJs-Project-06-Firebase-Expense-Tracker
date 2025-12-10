import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PrivateRoute({ children }) {

    const { currentUser } = useAuth()
    console.log(currentUser);
    return currentUser ? children : <Navigate to={'/'} />

}

export default PrivateRoute
