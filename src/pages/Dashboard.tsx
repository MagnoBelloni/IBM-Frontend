import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/auth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-12 offset-lg-1 col-lg-10 card">

                        <div className="card-body">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Saldo: R${user.balance}</h5>
                                </div>
                            </div>

                            <div className="row pt-2">
                                <div className="col-lg-6 col-sm-12 p-1">
                                    <div className="card bg-success">
                                        <div className="card-body">
                                            <Link to="/deposit" className="link-light">
                                                Depositar
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-sm-12  p-1">
                                    <div className="card bg-warning">
                                        <div className="card-body">
                                            <Link to="/withdraw" className="link-light">
                                                Sacar
                                        </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-sm-12 danger  p-1">
                                    <div className="card bg-danger">
                                        <div className="card-body">
                                            <Link to="/transfer" className="link-light">
                                                Transferir
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-sm-12  p-1">
                                    <div className="card bg-info">
                                        <div className="card-body">
                                            <Link to="/statement" className="link-light">
                                                Extrato bancário
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;