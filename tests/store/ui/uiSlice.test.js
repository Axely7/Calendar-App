import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice"

describe('Pruebas en el uiSlice', () => { 
    test('should debe de regresar el estado por defecto', () => { 
        console.log(uiSlice.getInitialState())
        expect(uiSlice.getInitialState()).toEqual({isDateModalOpen: false})
     })

     test('debe de cambiar el isDateModalOpen correctamente', () => { 
        let state = uiSlice.getInitialState();
        state = uiSlice.reducer(state, onOpenDateModal())
        expect(state.isDateModalOpen).toBeTruthy()

        state = uiSlice.reducer(state, onCloseDateModal())
        expect(state.isDateModalOpen).toBeFalsy()
      })
 })