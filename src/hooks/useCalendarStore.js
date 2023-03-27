import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import calendarApi from '../api/calendarApi'
import { convertEventsToDateEvents } from '../helpers'
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store'

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const {events, activeEvent} = useSelector(state => state.calendar)
    const {user} = useSelector(state => state.auth)
    
    const setActiveEvent = (calendarEvent) => {
      dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async(calendarEvent) => {
      // TODO: llegar al backend

      try {

        if(calendarEvent.id){
          // actualizando
          await calendarApi.put(`/event/${calendarEvent.id}`, calendarEvent)
          dispatch(onUpdateEvent({...calendarEvent, user}))
          return
  
        } 
          // creando
          const {data} = await calendarApi.post('/event', calendarEvent)
          console.log(data)
          dispatch(onAddNewEvent({...calendarEvent, id: data.msg.id, user}))
      } catch (error) {
        console.log(error)
        Swal.fire('Error al guardar', error.response.data.msg, 'error')
      }

     

      
    }

    const startDeletingEvent = async() => {
      try {
        if(activeEvent){
          await calendarApi.delete(`/event/${activeEvent.id}`)
          dispatch(onDeleteEvent())
        }
      
      } catch (error) {
        console.log(error)
        Swal.fire('Error al eliminar', error.response.data.msg, 'error')
      }
     
    }


    const startLoadingEvents = async () => {
      try {

        const {data} = await calendarApi.get('/event');
        console.log(data)
        const events = convertEventsToDateEvents(data.eventos)
        dispatch(onLoadEvents(events))
        console.log(events)
        
      } catch (error) {
        console.log('Error cargando eventos')
        console.log(error)
      }
    }


  return{ 
    // Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent?.id,

    //Methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
   }
}
