import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { ROOT_URL } from '../../../config'
import getInputInitialValue from '../../../utils/getInputInitialValue'
import Overlay from '../../Overlay'

const createInitialState = (configEntries, isAddForm, variantToShow) => {
    if (isAddForm) {
        return configEntries.reduce((state, input) => {
            const [key, value] = input
            const initialValue = getInputInitialValue(value.type)

            return {
                ...state,
                [key]: initialValue,
            }
        }, {})
    }

    const filteredVariantConfig = {}
    configEntries.forEach(([key, _]) => {
        filteredVariantConfig[key] = variantToShow[key]
    })

    return filteredVariantConfig
}

const processInputData = (inputData, config) => {
    const data = { ...inputData }
    Object.entries(config).forEach(([key, value]) => {
        if (value.isArray && !Array.isArray(data[key])) {
            data[key] = JSON.parse(data[key])
        }
        if (value.type === 'number' && typeof data[key] !== 'number') {
            data[key] = parseInt(data[key])
        }
    })

    console.log(data)

    return data
}

export default function VariantEditor({ variantId, variants, isAddForm, closeModal, config }) {
    const variantToShow = variants?.find((variant) => variant._id === variantId)
    const ref = useRef()
    const configEntries = Object.entries(config)
    const [inputData, setInputData] = useState(() => createInitialState(configEntries, isAddForm, variantToShow))
    const [isLoading, setIsLoading] = useState(false)

    const hanldeInputChange = (e) => {
        setInputData((prevInputData) => {
            return {
                ...prevInputData,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleDataSubmit = async (method) => {
        let url = `${ROOT_URL}/api/v1/variants`
        if (method === 'DELETE' || method === 'PATCH') url = `${ROOT_URL}/api/v1/variants/${variantToShow._id}`
        const axiosConfig = {
            method,
            url,
            withCredentials: true,
        }

        const data = processInputData(inputData, config)

        if (method !== 'DELETE') axiosConfig.data = data

        let successText
        switch (method) {
            case 'POST':
                successText = 'created'
                break
            case 'PATCH':
                successText = 'updated'
                break
            default:
                successText = 'deleted'
        }

        if (method === 'DELETE') {
            const isConfirmed = window.confirm(`Are you sure to delete the ${variantToShow.name} variant?`)
            if (!isConfirmed) return
        }

        setIsLoading(true)
        try {
            const res = await axios(axiosConfig)

            if (res.data.status === 'success') {
                alert(`The variant has been ${successText}.`)
                setTimeout(closeModal, 500)
            }
        } catch (err) {
            alert(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const inputElems = configEntries.map(([key, value]) => (
        <div className="form-group" key={key}>
            <label htmlFor="key" className="capitalize form-title">
                {key}: {value.type === 'date' ? inputData.expiresIn : ''}
            </label>
            {value.type === 'textarea' ? (
                <textarea
                    required={value.required}
                    name={key}
                    id={key}
                    className="form-input"
                    value={inputData[key]}
                    onChange={hanldeInputChange}
                    // disabled={value.disabled || false}
                ></textarea>
            ) : (
                <input
                    type={value.type}
                    required={value.required}
                    name={key}
                    id={key}
                    className="form-input"
                    value={inputData[key]}
                    onChange={hanldeInputChange}
                    // disabled={value.disabled || false}
                />
            )}
        </div>
    ))

    return (
        <>
            <Overlay childRef={ref}>
                <div ref={ref} className="admin-editor-form">
                    {variantToShow && !isAddForm && (
                        <>
                            <div className="flex justify-between">
                                <h3 className="admin-editor-form-title">{variantToShow.name}</h3>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-red-400 transition hover:text-red-300 active:text-red-500 cursor-pointer"
                                    onClick={() => handleDataSubmit('DELETE')}
                                />
                            </div>
                            <div className="text-slate-700 font-semibold mt-2">ID: {variantToShow._id}</div>
                        </>
                    )}
                    {isAddForm && (
                        <>
                            <h3 className="admin-editor-form-title">Create variant</h3>
                        </>
                    )}
                    {inputElems}

                    <div className="flex gap-4 mt-7">
                        <button
                            type="button"
                            className="w-1/2 text-center p-2 rounded-lg text-white font-semibold transition transform duration-200 bg-green-400 hover:-translate-y-1 hover:shadow-xl hover:bg-green-300 active:bg-green-500"
                            onClick={() => handleDataSubmit(isAddForm ? 'POST' : 'PATCH')}
                        >
                            {isAddForm ? 'Create' : 'Edit'}
                        </button>
                        <button
                            type="button"
                            className="w-1/2 text-center p-2 rounded-lg text-white font-semibold transition transform duration-200 bg-red-400 hover:-translate-y-1 hover:shadow-xl hover:bg-red-300 active:bg-red-500"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Overlay>
            {isLoading && (
                <div
                    className={`fixed z-30 top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center`}
                >
                    <FontAwesomeIcon icon={faSpinner} className="text-cyan-400 w-16 h-16 animate-spin" />
                </div>
            )}
        </>
    )
}
