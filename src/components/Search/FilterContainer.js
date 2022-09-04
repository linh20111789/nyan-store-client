import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import FilterSidebar from './FilterSidebar'
import FilterTopbar from './FilterTopbar'
import FilterView from './FilterView'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Alert from '../Alert/Alert'
import ReactDOM from 'react-dom'

export default function FilterContainer() {
    const [data, setData] = useState({})
    const [sortBy, setSortBy] = useState('oldest')
    const [viewBy, setViewBy] = useState('loose')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [showAlert, setShowAlert] = useState(false)

    const [openSidebar, setOpenSidebar] = useState(false)
    const { categoryName } = useParams()
    const categories = useSelector((state) => state.categories)
    const categoryId = categories.find((category) => category.name === categoryName)?._id
    const emptyCategoryId = categories.find((category) => category.name.toLowerCase() === 'empty')?._id
    console.log(categories, categoryId, categoryName)
    console.log(categoryId)

    return (
        <div className="filter-grid flex flex-row">
            <button
                className="fixed left-0 top-1/2 px-3 py-2 z-20 bg-white rounded-lg border border-slate-500 md:-translate-x-1/2 md:hover:-translate-x-0 transform transition duration-300 lg:hidden"
                onClick={() => {
                    setOpenSidebar(true)
                }}
            >
                <FontAwesomeIcon className="text-cyan-400" icon={faArrowRight} />
            </button>
            <div
                className={`w-64 fixed top-0 left-0 z-40 transform transition duration-300 h-screen overflow-auto ${
                    openSidebar ? 'translate-x-0' : '-translate-x-full'
                } bg-white md:translate-x-0 md:static md:h-max md:z-10`}
            >
                <FilterSidebar
                    setData={setData}
                    sortByTerm={sortBy}
                    categoryId={categoryId ? categoryId : null}
                    categoryName={categoryName}
                    setIsLoading={setIsLoading}
                    setMessage={setMessage}
                    setError={setError}
                    setShowAlert={setShowAlert}
                />
            </div>
            <div className="flex flex-col flex-grow bg-slate-200">
                <FilterTopbar
                    results={data.results}
                    onSortBy={setSortBy}
                    onViewBy={setViewBy}
                    categoryName={categoryName}
                />
                <FilterView products={data.data?.docs} viewBy={viewBy} />
            </div>
            <span
                onClick={() => setOpenSidebar(false)}
                className={`fixed top-0 left-0 w-full h-full transform transition duration-200 ${
                    openSidebar ? 'pointer-events-auto bg-slate-900/70' : 'pointer-events-none'
                }`}
            />
            {isLoading && (
                <div className="z-30 fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-cyan-400 w-16 h-16 animate-spin" />
                </div>
            )}
            {showAlert &&
                ReactDOM.createPortal(
                    <>
                        <Alert
                            type={message ? 'success' : 'error'}
                            message={message ? message : error ? error : ''}
                            delayToClose={3000}
                            closeCallback={() => setShowAlert(false)}
                        />
                    </>,
                    document.getElementById('modal-container')
                )}
        </div>
    )
}
