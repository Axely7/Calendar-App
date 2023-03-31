import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en calendarSlice', () => { 
    test('Debe de regresar el estado por defecto', () => { 
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState)
     })

     test('onSetActiveEvent debe de activar el evento', () => { 
        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        expect(state.activeEvent).toEqual(events[0])
      })

      test('onAddNewEvent debe de agregar el evento', () => { 
        const newEvent = {
            id: '3',
            title: 'Cumpleaños de jackson',
            notes: 'Hay que comprar pastel para perro',
            start: new Date('2022-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
        }

        const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent))
        expect(state.events).toEqual([...events, newEvent])
       })

       test('onUpdateEvent debe de actualizar el evento', () => { 
            const updateEvent = {
                id: '1',
                title: 'Cumpleaños de jackson actualizado',
                notes: 'Hay que comprar pastel para perro',
                start: new Date('2022-10-22 13:00:00'),
                end: new Date('2022-10-22 15:00:00'),
            }

            const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updateEvent))
            expect(state.events).toContain(updateEvent)


        })

        test('onDeleteEvent debe de borrar el evento sctivo', () => { 
            // calendarWithActiveEventState
            const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent())
            expect(state.events).not.toContain(events[0])

            const newState = calendarSlice.reducer(state, onLoadEvents(events));
            expect(newState.events.length).toBe(events.length)

         })

        test('onLoadEvents debe de establecer los eventos', () => { 
            const state = calendarSlice.reducer(initialState, onLoadEvents(events))
            expect(state.isLoadingEvents).toBeFalsy();
            expect(state).toEqual(calendarWithEventsState)
        
        })

        test('onLogoutCalendar debe de limpiar el estado', () => { 
            const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
            expect(state).toEqual(initialState)
        })


 })