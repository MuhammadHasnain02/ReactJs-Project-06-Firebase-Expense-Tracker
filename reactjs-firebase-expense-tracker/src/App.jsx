// Routing
import { Route, Routes } from 'react-router-dom'

// Components
import Signin from './components/Signin'
import Signup from './components/Signup'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'

function App(){
  
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/dashboard' element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
    </Routes>
  )

}

export default App