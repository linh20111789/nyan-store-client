import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import loginBackground from '../../imgs/ocean.jpg'
import { useAuthContext } from '../../context/authContext'
import { useNavigate, Link, useParams } from 'react-router-dom'
import Alert from '../Alert/Alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const DELAY_TIME = 3000

// Need to move the image background render to the className later
export default function ResetPassword() {
    const { resetToken } = useParams()
    const [showAlert, setShowAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const navigate = useNavigate()

    async function handleFormSubmit(e) {
        e.preventDefault()

        const password = passwordRef.current.value
        const passwordConfirm = passwordConfirmRef.current.value

        if (password == null) {
            setMessage('Please enter new password to reset!')
            setShowAlert(true)
            return
        }

        setIsLoading(true)
        setMessage('')
        setError('')

        try {
            const res = await axios({
                method: 'PATCH',
                url: `/api/v1/users/resetPassword/${resetToken}`,
                data: {
                    password,
                    passwordConfirm,
                },
            })

            if (res.data.status === 'success') {
                setMessage('Your password has been reset!')
                setTimeout(() => navigate('/login'), 2000)
            }
        } catch (err) {
            setError(err.response.data.message)
        } finally {
            setShowAlert(true)
            setIsLoading(false)
        }
    }

    const backgroundStyle = {
        backgroundImage: `url(${loginBackground})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
    }

    return (
        <section className="h-screen w-screen flex flex-col items-center justify-center" style={backgroundStyle}>
            <h1 className="auth-title text-white">Reset Password</h1>
            <form className="form bg-white shadow-md rounded-md p-7 mt-7" onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        id="password"
                        required
                        ref={passwordRef}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password-confirm" className="form-label">
                        Confirm Password:
                    </label>
                    <input
                        className="form-input"
                        type="password"
                        name="passwordConfirm"
                        id="password-confirm"
                        required
                        ref={passwordConfirmRef}
                    />
                </div>
                <button className="form-btn text-white" type="submit">
                    Reset now
                </button>
            </form>
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-cyan-400 w-16 h-16 animate-spin" />
                </div>
            )}
            {showAlert &&
                ReactDOM.createPortal(
                    <>
                        <Alert
                            type={message ? 'success' : 'error'}
                            message={message ? message : error ? error : ''}
                            delayToClose={DELAY_TIME}
                            closeCallback={() => setShowAlert(false)}
                        />
                    </>,
                    document.getElementById('modal-container')
                )}
        </section>
    )
}