import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../components/button';
import Input from '../components/input';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/auth';
import * as Yup from 'yup';
import getValidationErrors from '../utils/getValidationErros';
import { useToast } from '../hooks/toast';
import { FaMoneyBillWave, FaUser } from 'react-icons/fa';
import api from '../services/api';

interface TransferFormData {
    value: Number;
    accountNumber: String;
}

const Transfer: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();

    const history = useHistory();

    const formRef = useRef<FormHandles>(null);
    const handleSubmit = useCallback(
        async (data: TransferFormData) => {
            try {


                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    value: Yup.number()
                        .required('Valor a ser transferido é obrigatório.'),
                    accountNumber: Yup.string().required('Número da conta é obrigatório.')
                });


                await schema.validate(data, {
                    abortEarly: false,
                });
                console.log(data.value);

                const response = await api.post(`/transaction/transfer/${data.accountNumber}`, {
                    value: data.value
                })

                updateUser(response.data)

                history.push('/dashboard');

                addToast({
                    type: 'success',
                    title: 'Transferencia realizada com sucesso!',
                });
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);

                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro no ao trasnferir',
                    description: 'Ocorreu um erro ao tentar realizar uma transferencia, tente novamente mais tarde.',
                });
            }
        },
        [addToast, history, updateUser],
    );
    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-12 offset-lg-1 col-lg-10 card">
                        <h1 className="text-center">Sacar</h1>
                        <div className="card-body">

                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Saldo: R${user.balance}</h5>
                                </div>
                            </div>

                            <Form ref={formRef} onSubmit={handleSubmit} className="pt-3">
                                <Input
                                    name="value"
                                    icon={FaMoneyBillWave}
                                    type="number"
                                    placeholder="Valor a ser transferido"
                                />
                                <Input
                                    name="accountNumber"
                                    icon={FaUser}
                                    placeholder="Número da conta para transferencia"
                                />
                                <Button type="submit">Confirmar</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transfer;