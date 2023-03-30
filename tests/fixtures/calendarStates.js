export const tempEvent = [
    {
        id: '1',
        title: 'Cumpleaños de Axel',
        notes: 'Hay que comprar pastel',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
    },
    {
        id: '2',
        title: 'Cumpleaños de Karla',
        notes: 'Hay que comprar pastel de Karla',
        start: new Date('2022-11-21 13:00:00'),
        end: new Date('2022-11-21 15:00:00'),
    }
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: { ...events[0] }
}