import React from 'react'
import App from './App'
import { store } from 'store'
import { createRoot } from 'react-dom/client'

// style + assets
import 'assets/scss/style.scss'

// third party
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import ConfirmContextProvider from 'store/context/ConfirmContextProvider'
import MetaContextProvider from 'store/context/MetaContextProvider'
import { ReactFlowContext } from 'store/context/ReactFlowContext'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <MetaContextProvider>
                    <SnackbarProvider>
                        <ConfirmContextProvider>
                            <ReactFlowContext>
                                <App />
                            </ReactFlowContext>
                        </ConfirmContextProvider>
                    </SnackbarProvider>
                </MetaContextProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)
