import React, { useContext, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import '../css/card.css';
import userpic from '../image_profiles/user.jpeg';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
require('dotenv').config();
const Search = () => {
    const [query, setQuery] = useState({
        gtage: "18",
        ltage: "",
        gender: "Male",
        religion: "Hindu",
        marital_status: "UnMarried"
    });

    let name, value;
    const details_input = (event) => {
        name = event.target.name;
        value = event.target.value;
        setQuery({ ...query, [name]: value });
    }
    const [userData, setState] = useState([]);
    const [imagePath, setPath] = useState('');
    const PostData = async (event) => {
        console.log("search oanks");
        event.preventDefault();
        const { gtage, ltage, gender, religion } = query;

        if (gtage < 18) {
            toast.error("Minimum age should be 18.", { position: toast.POSITION.BOTTOM_CENTER});
        }
        else {
            const res = await fetch("/filter", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    gtage, ltage, gender, religion
                })
            });
            const data = await res.json();
            if (res.status === 422 || !data || res.status===404) {
                toast.error(data.error, { position: toast.POSITION.BOTTOM_CENTER});
                setState(null);
            } else {
                toast.success("Matches found! Scroll down to see", { position: toast.POSITION.BOTTOM_CENTER});
                setState(data);
                setPath("http://localhost:5000/public/userProfiles/")
                console.log(data);
            }
        }
    }
    return (
        <>
            <br /><br />
            <div className="container1">
                <form method="POST">
                    <br /><br /><br />
                    <div className="row">
                        <div className="col-md-3">
                            <h5>Age:&emsp;&emsp;&emsp;</h5>
                        </div>
                        <div className="col-md-3 ">
                            <input className="form-control" type="number" name="gtage" id="gtage" onChange={details_input} value={query.gtage}></input>
                        </div>
                        <div className="col-md-1 ">
                            <h5>To </h5>
                        </div>
                        <div className="col-md-3 ">
                            <input className="form-control" type="number" name="ltage" onChange={details_input} value={query.ltage}></input>
                        </div>


                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <h5>Gender:&emsp;</h5>
                        </div>
                        <div className="col-md-3">

                            {/* <label className="form-label">Gender :&emsp;</label> */}
                            <select name="gender" placeholder="Select Gender" onChange={details_input} className="form-select"
                                value={query.gender}>
                                {/* <option value="" disabled="disable" selected>Select Gender</option> */}
                                <option value="Male" selected="true" >Male</option>
                                <option value="Female" >Female</option>
                            </select>
                        </div>


                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <h5>Religion:&emsp;</h5>
                        </div>
                        <div className="col-md-3">


                            <select name="religion" id="religion" onChange={details_input} className="form-select" value={query.religion} required>
                                {/* <option value="" selected="selected" disabled="disable" >Select a Religion</option> */}
                                <option value="Hindu" selected="true">Hindu</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Christian">Christian</option>
                                <option value="Buddhist">Buddhist</option>
                                <option value="Jain">Jain</option>
                                <option value="Parsi">Parsi</option>
                                <option value="Jewish">Jewish</option>
                                <option value="Bahai">Bahai</option>
                            </select>


                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <h5>Marital Status:&emsp;</h5>
                        </div>
                        <div className="col-md-3">


                            <select name="marital_status" id="marital_status" className="form-select" placeholder="Status" onChange={details_input}
                                value={query.marital_status} required >
                                <option value="Never Married" selected="true">Un-Married</option>
                                <option value="Married">Married</option>
                                <option value="Awaiting Divorce">Awaiting Divorce</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Annulled">Annulled</option>
                            </select>


                        </div>
                    </div>

                    <br />
                    <center>
                        <div className="form-group">
                            <button className="btn btn-primary " type="submit" onClick={PostData} id="loginbutton">Find Matches</button>
                        </div>
                    </center>
                    <br />
                </form>
            </div>
            <section id="services" class="services section-bg mt-5">
                <div Cssclass="container" data-aos="fade-up">
                    <div CssClass="row" >
                        {Array.isArray(userData)&& userData.map((item, index) => {

                              
                            return (
                                <div data-aos="zoom-in" data-aos-delay="100">
                                    <div class="box">

                                        <img src={item.profile ? imagePath + item.profile : userpic} />
                                        <p key={index}>
                                            <p className="pe"><i className="zmdi zmdi-account material-icons-name "></i>&nbsp;{item.name}</p>
                                            <p className="pe">{item.age} yrs</p>
                                            <Link to={`/viewprofile/${item._id}`}><button className="btn btn-warning">View Profile</button></Link>
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </section>
            <br />

        </>
    )
}
export default Search;