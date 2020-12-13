import { Link, useHistory } from 'react-router-dom';

import Input from '../components/input';
import Button from '../components/button';

import { FiLock, FiUser, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../hooks/auth';
import { useToast } from '../hooks/toast';
import { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../utils/getValidationErros';

interface SignInFormData {
    account_number: string
    password: string
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { signIn } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SignInFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    account_number: Yup.string()
                        .required('Número da conta é obrigatório.'),
                    password: Yup.string().required('Senha é obrigatório.'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await signIn({
                    account_number: data.account_number,
                    password: data.password,
                });

                history.push('/dashboard');
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);

                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro na autenticação',
                    description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
                });
            }
        },
        [signIn, addToast, history],
    );

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col col-sm-12 offset-lg-3 col-lg-6 card">
                    <h1 className="text-center">Entre</h1>
                    <div className="card-body">
                        <Form ref={formRef} onSubmit={handleSubmit}>
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
                            <Button type="submit">Entrar</Button>
                        </Form>
                        <Link to="/signup" className="mt-5 card-link">
                            <FiLogIn />Não tem uma conta? Clique aqui.
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;