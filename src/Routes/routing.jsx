import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import SignIn from '../pages/SignIn'
import Profile from '../pages/Profile'
import Header from '../components/Header'
import SignUp from '../pages/SignUp'

export default function routing() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/About' element={<About />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
    </>
  )
}
