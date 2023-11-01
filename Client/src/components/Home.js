import React, { useContext, useEffect, useState } from "react";
import userpic from '../image_profiles/user.jpeg';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { NavLink } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../App";
import "../web/css/bootstrap.css";
import "../web/css/style1.css";


require('dotenv').config();
const Home = () => {
    const { state, dispatch } = useContext(UserContext);
    const [query, setQuery] = useState({
        gtage: "18",
        ltage: "",
        gender: "Male",
        religion: "Hindu"
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
            if (res.status === 422 || !data) {
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
        <div>
          <div class="w3layouts-banner" id="home">
            </div>
            <div class="w3l_find-soulmate text-center">
            <br/>
            <br/>
                <h3>Find Your Soulmate</h3>
                <center>
                    <div class="container">
                        
                        <NavLink className="scroll" to="/home">
                            <div class="col-md-3 w3_soulgrid">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                <h3>Sign Up</h3>
                                <p>Upload your profile</p>
                            </div>
                        </NavLink>
                        <NavLink className="scroll" to="/search">
                            <div class="col-md-3 w3_soulgrid">
                                <i class="fa fa-search" aria-hidden="true"></i>
                                <h3>Search</h3>
                                <p>Search for right partner</p>
                            </div>
                        </NavLink>
                        <NavLink className="scroll" to="/login">
                            <div class="col-md-3 w3_soulgrid">
                                <i class="fa fa-users" aria-hidden="true"></i>
                                <h3>Connect</h3>
                                <p>Find perfect Match</p>
                            </div>
                        </NavLink>
                        <br />
                        {/* <a class="scroll" href="#home">
                            <div class="col-md-2 w3_soulgrid">
                                <i class="fa fa-comments-o" aria-hidden="true"></i>
                                <h3>Interact</h3>
                                <p>Start Conversation</p>
                            </div>
                        </a>&emsp; */}



                    </div>
                    <br />
                </center>
            </div>
            <br />
            <div class="agile-assisted-service text-center">
                <h4>Assisted Service</h4>
                <p>Our Relationship Managers have helped thousands of members find their life partners.</p>

            </div>
        </div>
    )
}

export default Home