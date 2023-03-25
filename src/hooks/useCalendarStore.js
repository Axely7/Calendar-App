import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import calendarApi from '../api/calendarApi'
import { convertEventsToDateEvents } from '../helpers'
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store'

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const {events, activeEvent} = useSelector(state => state.calendar)
    const {user} = useSelector(state => state.auth)
    
    const setActiveEvent = (calendarEvent) => {
      dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async(calendarEvent) => {
      // TODO: llegar al backend

      if(calendarEvent._id){
        // actualizando
        dispatch(onUpdateEvent({...calendarEvent}))

      } else {
        // creando
        const {data} = await calendarApi.post('/event', calendarEvent)
        console.log(data)
        dispatch(onAddNewEvent({...calendarEvent, id: data.msg.id, user}))

      }
    }

    const startDeletingEvent = async() => {
      dispatch(onDeleteEvent())
    }


    const startLoadingEvents = async () => {
      try {

        const {data} = await calendarApi.get('/event');
        console.log(data)
        const events = convertEventsToDateEvents(data.eventos)
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
    hasEventSelected: !!activeEvent?._id,

    //Methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
   }
}
