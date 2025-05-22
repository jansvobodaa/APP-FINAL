
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

//instance axiosu
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
    'Content-Type': 'application/json',
    },
});


export const fetchData = async () => {
    try {
    const response = await api.get('/data');
    return response.data;
    } catch (error) {
    console.error('Chyba při načítání dat:', error);
    throw error;
    }
};


export const sendData = async (payload) => {
    try {
    const response = await api.post('/data', payload); 
    return response.data;
    } catch (error) {
    console.error('Chyba při odesílání dat:', error);
    throw error;
    }
};
