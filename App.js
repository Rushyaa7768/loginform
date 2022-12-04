import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Routing from './components/Routing'


const App = () => {
  return (
    <>
    
    <BrowserRouter>
                <Routing/>    
    </BrowserRouter>
    </>
  )
}

export default App