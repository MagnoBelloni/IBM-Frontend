import React from "react"
import { FiPower } from "react-icons/fi";
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/auth";

const Navbar: React.FC = () => {
    const { signOut, user } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ backgroundColor: "#e3f2fd" }}>
            <div className="container">
                <Link className="navbar-brand" to="/">IBM</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">
                                Home
                            </Link>
                        </li>
                    </ul>
                    <p className="pt-2">Bem vindo <b>{user.name}</b></p>
                    <div className="right">

                        <button onClick={signOut} className="btn btn-outline-danger" type="submit">
                            <FiPower />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar