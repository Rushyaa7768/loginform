import React, { useState } from 'react'
import Home from './Home'
import Navb from './Navb'
import Login from './Login'
import { Route, Routes } from 'react-router'
import Dashboard from './Dashboard'
import { useSelector } from 'react-redux'

const Routing = () => {
  const isLoggedIn=useSelector(state=>state.isLoggedIn)
  console.log(isLoggedIn);
 
  return (
    
<>
<React.Fragment>
  <header>
    <Navb/>
  </header>
  <main>
  <Routes>
    <Route exact to path="/login" element={ <Login/>}/>
    <Route exact to path="/" element={<Home/>}/>
    {isLoggedIn && <Route exact to path="/:id" element={<Home/>}/>}
    {isLoggedIn && <Route exact to path="/dashboard/:id" element={<Dashboard/>}/>}
  </Routes>
  </main>
</React.Fragment>

</>
  )
}

export default Routing