import { React, useState } from 'react'
import Login from './Login';
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { authActions } from '../store/index';

axios.defaults.withCredentials = true;

const Navb = () => {
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const dispatch = useDispatch();
  const sendLogout = async () => {
  const res = await axios.post("http://localhost:3333/user/logout", null, { withCredentials: true })
  }
  const handleLogout = () => {
    sendLogout().then(() => { dispatch(authActions.logout()) })
  }
  return (
    <>
      <div className=" bg-light nav">
        <div className="container-fluid ">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6   "><NavLink className="nav-link " exact to="/"><h3> WELCOME </h3></NavLink></div>
            <div className='col-md-6  d-flex justify-content-end'>
              <div className="d-flex ">
                {!isLoggedIn && ( <Login/>
              )}
                {isLoggedIn && (
                  <li className="nav-item"><NavLink className="nav-link" onClick={handleLogout} exact to="/">Logout</NavLink></li>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navb;