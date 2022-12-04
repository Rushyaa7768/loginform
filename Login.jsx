
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/index';
import { NavLink } from 'react-router-dom';

const Login = () => {
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const [Fname, setFname] = useState();
  const [Lname, setLname] = useState();
  const [PasswordError, setPasswordError] = useState("");
  // const navigator = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    const user = {
      Fname: Fname,
      Lname: Lname,
      EmailId: email,
      Password: password
    }
    console.log(user);
    if (!validPassword.test(user.Password)) {
      setPasswordError("Password Must Conatin one Upper case and Lower case alphabet one character and symbol")
    }
    else {
      setPasswordError("")
      axios.post("http://localhost:3333/user/signup", user)
        .then((res) => {
          console.log(res);
          alert("user Ac Created sucess");
          navigator("/");
        })
        .catch(err => { new Error(err) })
    }
  }



  const loginHandler = (e) => {
    e.preventDefault();
    const user = {
      EmailId: email,
      Password: password
    
    }
    console.log(user);
    axios.post("http://localhost:3333/user/login", user)
      .then(async (res) => {
        const data = await res.data
        //    setUserdata(data);
        console.log(data);
        console.log(data.user._id)

        // data.user.EmailId === "admin@gmail.com"?navigator(`/dashboard/${data.user._id}`):   navigator(`/${data.user._id}`);

        // if (data.user.EmailId === "admin@gmail.com") {
          
          navigator(`/dashboard/${data.user._id}`)
        // } else {
          //  navigator(`/${data.user._id}`);
          // navigator("/");
        // }
      }).then(() => { dispatch(authActions.login()) })

      .catch(err => { console.log(err) })
  }
  return (
    <>
      <li className="nav-item"><NavLink className="nav-link" data-bs-toggle="modal" data-bs-target="#loginModal" ><i className="fa-solid fa-user"></i></NavLink>   </li>

      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog ">
          <div className="modal-content  p-2 ">
            <div className="modal-header">
              <h5 className="modal-title col-12 text-center" id="exampleModalLabel">Login</h5>
              <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={loginHandler}>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="mb-3 ">
                    <label for="exampleInputEmail1" className="form-label ">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={e => setEmail(e.target.value)} value={email} required />
                  </div>
                  <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" onChange={e => setPassword(e.target.value)} value={password} required/>
                  </div>

                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary col-12" data-bs-toggle="modal" data-bs-dismiss="modal" >Login</button>
                  </div>
                </div>
              </div>
            </form>
            <div className="mb-3 text-center" data-bs-dismiss="modal">
            <li   >  Don't have an account? <NavLink  data-bs-toggle="modal" data-bs-target="#signupModal" style={{ textDecoration: 'none' }}> SignUp   </NavLink></li>
                  </div>
            <div className="modal-footer">
              <div className="mb-3 col-12 ">
                <button type="button" className="btn btn-outline-warning col-12" data-bs-dismiss="modal" >Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>









      <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog ">
          <div className="modal-content  p-2 ">
            <div className="modal-header">
              <h5 className="modal-title col-12 text-center" id="exampleModalLabel">SignUp</h5>
              <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={submitHandler}>
              <div className="container">
                <div className="row justify-content-center">
                <div className="mb-3 ">
                    <label for="exampleInputText1" className="form-label ">First Name</label>
                    <input type="text" className="form-control" id="exampleInputText1" aria-describedby="textHelp" onChange={e => setFname(e.target.value)} value={Fname} required />
                  </div>
                  <div className="mb-3 ">
                    <label for="exampleInputText2" className="form-label ">Last Name</label>
                    <input type="text" className="form-control" id="exampleInputText2" aria-describedby="textHelp" onChange={e => setLname(e.target.value)} value={Lname} required />
                  </div>

                  <div className="mb-3 ">
                    <label for="exampleInputEmail2" className="form-label ">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" onChange={e => setEmail(e.target.value)} value={email} required />
                  </div>
                  <div className="mb-3">
                    <label for="exampleInputPassword2" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword2" onChange={e => setPassword(e.target.value)} value={password} required/>
                  </div>
                  <div className="mb-3">
                    <span>{PasswordError}</span>
                  </div>

                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary col-12" data-bs-toggle="modal" data-bs-dismiss="modal"> Submit </button>
                  </div>
                </div>
              </div>
            </form>
            
            <div className="modal-footer">
              <div className="mb-3 col-12 ">
                <button type="button" className="btn btn-outline-warning col-12" data-bs-dismiss="modal" >Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
export default Login;