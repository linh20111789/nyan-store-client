import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import SideNavigation from './SideNavigation'

function SidebarNavigationDrawer() {
    const [openSidebar, setOpenSidebar] = useState(false)
    const drawerRef = useRef()

    function handleLayerClick(e) {
        setOpenSidebar(false)
    }

    return (
        <>
            <button
                className="fixed left-0 top-1/2 px-3 py-2 z-30 bg-white rounded-lg border border-slate-500 md:-translate-x-1/2 md:hover:-translate-x-0 transform transition duration-300 lg:hidden"
                onClick={() => {
                    setOpenSidebar(true)
                }}
            >
                <FontAwesomeIcon className="text-cyan-400" icon={faArrowRight} />
            </button>

            {ReactDOM.createPortal(
                <>
                    <div
                        className={`fixed top-0 left-0 lg:hidden w-full h-full z-20 ${
                            openSidebar ? 'pointer-events-auto' : 'pointer-events-none'
                        }`}
                    >
                        <span
                            onClick={handleLayerClick}
                            className={`absolute top-0 left-0 w-full h-full transform transition duration-200 ${
                                openSidebar ? 'pointer-events-auto bg-slate-900/70' : 'pointer-events-none'
                            }`}
                        />
                        <div
                            className={`fixed top-0 left-0 transform transition duration-200 h-full ${
                                openSidebar ? 'translate-x-0' : '-translate-x-full'
                            }`}
                            ref={drawerRef}
                        >
                            <div className="w-64 h-full flex flex-shrink-0">
                                <SideNavigation title="Categories" isDrawer={true} />
                            </div>
                            <button className="absolute top-5 right-5" onClick={() => setOpenSidebar(false)}>
                                &times;
                            </button>
                        </div>
                    </div>
                </>,
                document.getElementById('modal-container')
            )}
        </>
    )
}

export default SidebarNavigationDrawer
