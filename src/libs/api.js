import axios from "axios";

const baseUrl = "http://localhost:3000";

export async function getData(endpoint) {
    try {
        let response = await axios.get(`${baseUrl}/${endpoint}`);

        return response;
    } catch (error) {
        throw error;
    };
};

export async function postData(endpoint, body) {
    try {
        let response = await axios.post(`${baseUrl}/${endpoint}`, body);

        return response;
    } catch (error) {
        throw error;
    };
};

export async function patchData(endpoint, body) {
    try {
        let response = await axios.patch(`${baseUrl}/${endpoint}`, body);
       
        return response;
    } catch (error) {
        throw error;
    }
};
