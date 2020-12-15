import { Link, useHistory } from 'react-router-dom';

import Input from '../components/input';
import Button from '../components/button';

import { FiLock, FiUser, FiChevronLeft, FiMail } from 'react-icons/fi';
import { BsFillPersonLinesFill, BsFillStopwatchFill } from 'react-icons/bs';
import { useToast } from '../hooks/toast';
import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../utils/getValidationErros';
import api from '../services/api';

interface SignUpFormData {
    name: string;
    age: number;
    email: string;
    account_number: string
    password: string
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SignUpFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('O nome é obrigatório.'),
                    age: Yup.number().required('A idade é obrigatória.'),
                    email: Yup.string().required('O e-mail é obrigatório.').email('Insira um e-mail valido.'),
                    account_number: Yup.string()
                        .required('Número da conta é obrigatório.'),
                    password: Yup.string().required('Senha é obrigatório.'),
                    confirm_password: Yup.string()
                        .required('Confirmação de senha é obrigatório')
                        .oneOf([Yup.ref('password'), ''], 'As senhas devem ser iguais.')
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/client', data);

                history.push('/');

                addToast({
                    type: 'success',
                    title: 'Cadastro realizado com sucesso!',
                    description: 'Você já pode fazer seu logon :)',
                });
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);

                    formRef.current?.setErrors(errors);

                    return;
                }

                if (error.response.status === 500) {
                    addToast({
                        type: 'error',
                        title: 'Erro no Cadastro',
                        description: 'Ocorreu um erro ao se cadastrar, tente novamente mais tarde.',
                    });
                } else {
                    console.log(error.response);

                    addToast({
                        type: 'error',
                        title: 'Erro no Cadastro',
                        description: error.response.data.message,
                    });
                }
            }
        },
        [addToast, history],
    );

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col col-sm-12 offset-lg-3 col-lg-6 card">
                    <h1 className="text-center">Cadastre-se</h1>
                    <div className="card-body">
                        <Form ref={formRef} onSubmit={handleSubmit}>
                            <Input
                                name="name"
                                icon={BsFillPersonLinesFill}
                                placeholder="Nome"
                            />
                            <Input
                                name="age"
                                icon={BsFillStopwatchFill}
                                placeholder="Idade"
                            />
                            <Input
                                name="email"
                                icon={FiMail}
                                placeholder="E-mail"
                            />
                            <Input
                                name="account_number"
                                icon={FiUser}
                                placeholder="Número da conta"
                            />
                            <Input
                                name="password"
                                icon={FiLock}
                                type="password"
                                placeholder="Senha"
                            />
                            <Input
                                name="confirm_password"
                                icon={FiLock}
                                type="password"
                                placeholder="Confirmação de Senha"
                            />
                            <Button type="submit">Entrar</Button>
                        </Form>
                        <Link to="/" className="mt-5 card-link">
                            <FiChevronLeft />Voltar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;