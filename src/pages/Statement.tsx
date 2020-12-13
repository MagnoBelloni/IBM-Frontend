import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/auth';
import api from '../services/api';

interface Transaction {
    type: string;
    value: number;
    oldBalance: number;
    newBalance: number;
    date: string;
    to: string;
    from: string;
}

const Statement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const { user } = useAuth();

    const formattedTypes = {
        "income transfer": ["Transferencia recebida", "bg-success text-white"],
        "outgoing transfer": ["Transferencia enviada", "bg-info text-white"],
        "deposit": ["Deposito", "bg-success text-white"],
        "withdraw": ["Saque", "bg-danger text-white"]
    }

    useEffect(() => {


        api.get('/transaction')
            .then(response => {
                const transactionsFormatted = response.data[0].transactions
                    .map((transaction: Transaction) => {
                        return {
                            ...transaction,
                            // type: (formattedTypes as any)[transaction.type][0] || 'Outro',
                            date: format(parseISO(transaction.date), 'HH:mm dd/MM/yyyy')
                        }
                    })
                setTransactions(transactionsFormatted)
            })
    }, [])

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-12 offset-lg-1 col-lg-10 card">
                        <h1 className="text-center">Extrato</h1>
                        <div className="card-body">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Saldo: R${user.balance}</h5>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Tipo</th>
                                        <th scope="col">Valor transacionado</th>
                                        <th scope="col">Saldo antigo</th>
                                        <th scope="col">Saldo Novo</th>
                                        <th scope="col">Data</th>
                                        <th scope="col">De</th>
                                        <th scope="col">Para</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(transaction => (
                                        <tr key={`${transaction.value} - ${transaction.date} - ${transaction.to}`} className={(formattedTypes as any)[transaction.type][1]}>
                                            <td>{(formattedTypes as any)[transaction.type][0] || 'Outro'}</td>
                                            <td>{transaction.value}</td>
                                            <td>{transaction.oldBalance}</td>
                                            <td>{transaction.newBalance}</td>
                                            <td>{transaction.date}</td>
                                            <td>{transaction.to ? transaction.to : '-'}</td>
                                            <td>{transaction.from ? transaction.from : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Statement;