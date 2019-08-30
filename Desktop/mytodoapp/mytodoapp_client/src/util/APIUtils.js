import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllLists(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/lists?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getListsById(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/lists?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getListsById2(listId,page,size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
         url: API_BASE_URL + `/lists/getListById/${listId}`,
        method: 'GET'
    });
}

export function getItemById(data,page,size) {
    console.log("getItemById",data);
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
         url: API_BASE_URL + `/lists/getItemById/${data.listId}/items/${data.itemId}`,
        method: 'GET'
    });
}








export function createList(pollData) {
    return request({
        url: API_BASE_URL + "/lists",
        method: 'POST',
        body: JSON.stringify(pollData)
    });
}

export function updateList(pollData) {
    return request({
        url: API_BASE_URL + `/lists/updateList/${pollData.listId}`,
        method: 'PUT',
        body: JSON.stringify(pollData)
    });
}

export function updateItem(pollData) {
    return request({
         url: API_BASE_URL + `/lists/updateItem/${pollData.listId}/items/${pollData.itemId}`,
        method: 'PUT',
        body: JSON.stringify(pollData)
    });
}

export function updateItemStatus(itemId,listId) {
    return request({
         url: API_BASE_URL + `/lists/updateItemStatus/${listId}/items/${itemId}`,
        method: 'PUT',
        body: JSON.stringify({})
    });
}


export function createItem(pollData) {
    return request({
        url: API_BASE_URL + "/lists/items",
        method: 'POST',
        body: JSON.stringify(pollData)
    });
}

export function deleteList(listId) {
    return request({
        url: API_BASE_URL + `/lists/deleteList/${listId}`,
        method: 'DELETE'
    });
}

export function deleteItem(itemId) {
    return request({
        url: API_BASE_URL + `/lists/deleteItem/${itemId}`,
        method: 'DELETE'
    });
}



export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}