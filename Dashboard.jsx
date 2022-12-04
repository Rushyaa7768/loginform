import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";


let firsttoken = true;
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const [userdata, setUserdata] = useState([]);
  // console.log(userdata);
  const params=useParams();
  // console.log(params.id);
  const refreshToken = async () => {
    const res = await axios
      .get("http://localhost:3333/user/refresh", { withCredentials: true })
      .catch((err) => console.log(err));
    const data = await res.data;
    console.log(data);
    return data;
  };

  const sendReequest = async () => {
    const res = await axios
      .get("http://localhost:3333/user/verifytoken", { withCredentials: true })
      .catch((err) => console.log(err));
    const data = await res.data;
    console.log(data);
    return data;
  };

  useEffect(() => {
    if (firsttoken) {
      firsttoken = false;
      sendReequest().then((data) => setUserdata(data.Fname));
    }
    let interval = setInterval(() => {
      refreshToken().then((data) => setUserdata(data.Fname));
    }, 1000 * 29);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="U-pro">
        <div className="profile">
          <button></button>
          <br />
          <label> Profile </label>
          <h1>{userdata}</h1>
        </div>
        <div className="content">
          <h1> WELCOME TO DASHBOARD</h1>
        </div>
      </div>

    </>
  );
};

export default Dashboard;
