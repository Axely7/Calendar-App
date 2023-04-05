import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import calendarApi from "../../src/api/calendarApi"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { testUserCredentials } from "../fixtures/testUser"

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
           auth: authSlice.reducer
        },
        preloadedState: {
           auth: {...initialState}
        }
    })
}



describe('Pruebas en el useAuthStore', () => { 

    beforeEach(() => localStorage.clear())


    test('Debe de regresar los valores por defecto', () => { 
        const mockStore = getMockStore({...initialState})
        const {result} = renderHook(() => useAuthStore(), {wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>})

       expect(result.current).toEqual({
        status: 'checking',
        user: {},
        errorMessage: undefined,
        startLogin: expect.any(Function),
        startRegister: expect.any(Function),
        checkAuthToken: expect.any(Function),
        startLogout: expect.any(Function)
       })
     })

     test('startLogin debe de realizar el login correctamente', async () => { 
        localStorage.clear()
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>})


       await  act(async() => {
            await result.current.startLogin(testUserCredentials)
        })

        console.log(result.current)

        const {errorMessage, status, user} = result.current;
        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '642d9c976c81f6549f38c9b2'}
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
       
      })

    test('startLogin debe de fallar la autenticación', async() => { 
        localStorage.clear()
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>})


       await  act(async() => {
            await result.current.startLogin({email: 'refri@gmail.com', password: '1234567'})
        })

        const {errorMessage, status, user} = result.current;
        expect(localStorage.getItem('token')).toBe(null)
        expect({errorMessage, status, user}).toEqual( {
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        })

       await  waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        )
     })

     test('startRegister debe de crear un usuario', async() => { 

        const newUser = {email: 'refri@gmail.com', password: '1234567', name: 'Test User 2'}
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>})

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                "ok": true,
                "uid": "123456789",
                "name": "Test User",
                "token": "ALGUN-TOKEN"
        }
            
        })

       await  act(async() => {
            await result.current.startRegister(newUser)
        });

        const {errorMessage, status, user} = result.current
        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '123456789' }
          })

        spy.mockRestore() // Siempre terminar el spy
      })

      test('startRegister debe de fallar la creación', async() => { 
      
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>})

       await  act(async() => {
            await result.current.startRegister(testUserCredentials)
        });

        const {errorMessage, status, user} = result.current
        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '123456789' }
          })

      
    })

      
 })