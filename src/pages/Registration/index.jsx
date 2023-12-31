import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { fetchAuthRegister, selectIsAuth } from '../../redux/slices/auth';
import styles from './Login.module.scss';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from '@mui/material';

export const Registration = () => {
	const [values, setValues] = React.useState({
		amount: '',
		password: '',
		weight: '',
		weightRange: '',
		showPassword: false,
	});
	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};

	const handleMouseDownPassword = event => {
		event.preventDefault();
	};
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		mode: 'onChange',
	});
	const onSubmit = async values => {
		const data = await dispatch(fetchAuthRegister(values));
		console.log(data);
		if (!data.payload) {
			return alert('Не удалось зарегистрироваться!Возможно данный email уже зарегистрирвоанный');
		}
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		}
	};

	if (isAuth) {
		return <Navigate to='/' />;
	}
	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Укажите полное имя' })}
					className={styles.field}
					label='Полное имя'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					type='email'
					{...register('email', { required: 'Укажите почту' })}
					className={styles.field}
					label='E-Mail'
					fullWidth
				/>
				<TextField
					type={values.showPassword ? 'text' : 'password'}
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль' })}
					className={styles.field}
					label='Пароль'
					fullWidth
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge='end'
								>
									{values.showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<Button
					disabled={!isValid}
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
