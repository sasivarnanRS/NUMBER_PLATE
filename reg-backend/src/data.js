export const data = {
    registrations: [
        {
            id: '1',
            regNum: 'TN 37 AX 2585',
            owner: 'Pilot',
            type: 'car',
            model: 'BMW',
            manufacturer: 'BMW',
            state: 'Tamil Nadu',
            date: '2026-01-05',
            status: 'Active',
            chassis: 'VIN1234567890ABC',
            engine: 'ENG987654321'
        }
    ],
    users: [
        { id: '1', name: 'Pilot', email: 'user@example.com', role: 'user', joined: '2026-01-01' },
        { id: '2', name: 'AdminX', email: 'admin@reg.gov', role: 'admin', joined: '2025-12-01' },
        { id: '3', name: 'Alice', email: 'alice@tesla.com', role: 'user', joined: '2026-01-02' }
    ],
    vehicleTypes: [
        { id: 'car', name: 'Car', baseReg: 'CA' },
        { id: 'bike', name: 'Bike', baseReg: 'BI' },
        { id: 'truck', name: 'Truck', baseReg: 'TR' },
        { id: 'bus', name: 'Bus', baseReg: 'BU' },
        { id: 'tractor', name: 'Tractor', baseReg: 'TC' },
        { id: 'ev', name: 'Electric Vehicle', baseReg: 'EV' }
    ],
    history: [
        { date: '2026-01-05 14:30', event: 'Registration Generated', detail: 'ID: TN 37 AX 2585' }
    ]
};
