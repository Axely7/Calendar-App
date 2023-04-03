import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook } from "@testing-library/react"
import { Provider } from "react-redux"
import { useUIStore } from "../../src/hooks/useUIStore"
import { store, uiSlice } from "../../src/store"


const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}



describe('Pruebas en el useUiStore', () => { 
    test('Debe de regresar los valores por defecto', () => { 

        const mockStore = getMockStore({isDateModalOpen: false})
        const {result} = renderHook(() => useUIStore(), {wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>})

        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function)
        })
     })

    test('openDateModal debe de colocar true en el isDateModalOpen', () => { 
        const mockStore = getMockStore({isDateModalOpen: false})
        const {result} = renderHook(() => useUIStore(), {wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>})

        const {isDateModalOpen, openDateModal} = result.current

        act(() => {
            openDateModal()
        })
        console.log({result: result.current, isDateModalOpen})

        expect(result.current.isDateModalOpen).toBeTruthy()

     })
 })