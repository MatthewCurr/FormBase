// Base URL for the Interview App RESTful API
const API_BASE_URL = 'https://comp2140a3.uqcloud.net/api';

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
// From the A2 JSON Web Token column, view Feedback to show your JWT
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ2OTcxNzMifQ.-y9bHTmY3nDNVvVz6gT37_pzU215RWsa0S03Mzppy5Y';

// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = 's4697173';

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 * 
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH)
    headers: {
      'Content-Type': 'application/json', // Indicate that we are sending JSON data
      'Authorization': `Bearer ${JWT_TOKEN}` // Include the JWT token for authentication
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // If a body is provided, add it to the request and include the username
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  console.log('📡 Fetching:', endpoint);
  console.log('🧾 Options:', options);

  // Make the API request and check if the response is OK
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // If DELETE or 204 No Content, don’t parse JSON
  if (method === 'DELETE' || response.status === 204) {
    return null;
  }
  
  // Return the response as a JSON object
  return response.json();
}

/* =============================
 *      Form Functions
 * =============================
 */

/**
 * Function to insert a new form into the database.
 * 
 * @param {object} form - The form data to insert.
 * @returns {Promise<object>} - The created form object returned by the API.
 */
export async function createForm(form) {
  console.log("Creating form with data:", form);  
  return apiRequest('/form', 'POST', form);
}

/**
 * Function to update an existing form
 * 
 * @param {string} id - The form id to update
 * @returns {Promise<object>} - The updated form object.  
 */
export async function updateForm(form, id) {
  return apiRequest(`/form?id=eq.${id}`, 'PATCH', form)
}

/**
 * Function to delete an existing form
 * 
 * @param {string} id - The form id to delete
 * @returns {Promise<object>} - Response as a JSON object  
 */
export async function deleteForm(id) {
  console.log("Deleting form with id:", id);
  return apiRequest(`/form?id=eq.${id}`, 'DELETE')
}

/**
 * Function to list all forms associated with the current user.
 * 
 * @returns {Promise<Array>} - An array of form objects.
 */
export async function getForms() {
  return apiRequest('/form');
}

/**
 * Function to get a single form by its ID.
 * @param {string} id - The ID of the form to retrieve.
 * @returns {Promise<object>} - The form object matching the ID.
 */
export async function getForm(id) {
  return apiRequest(`/form?id=eq.${id}`);
}

/* =============================
 *      Field Functions
 * =============================
 */

/**
 * Function to insert a new field into the database.
 * 
 * @param {object} field - The field data to insert.
 * @returns {Promise<object>} - The created field object returned by the API.
 */
export async function createField(field) {
  console.log("Creating field with data:", field);  
  return apiRequest('/field', 'POST', field);
}

/**
 * Function to update an existing field
 * 
 * @param {string} id - The field id to update
 * @returns {Promise<object>} - The updated field object.  
 */
export async function updateField(field, id) {
  return apiRequest(`/field?id=eq.${id}`, 'PATCH', field)
}

/**
 * Function to delete an existing field
 * 
 * @param {string} id - The field id to delete
 * @returns {Promise<object>} - Response as a JSON object  
 */
export async function deleteField(id) {
  console.log("Deleting field with id:", id);
  return apiRequest(`/field?id=eq.${id}`, 'DELETE')
}

/**
 * Function to list all fields associated with the given form id.
 * 
 * @param {string} form_id - The ID of the form to retrieve fields from.
 * @returns {Promise<Array>} - An array of field objects.
 */
export async function getFields(form_id) {
  if (form_id)
    return apiRequest(`/field?form_id=eq.${form_id}`);
  else
    return apiRequest(`/field`);
}

/**
 * Function to get a single field by its ID.
 * 
 * @param {string} id - The ID of the field to retrieve.
 * @returns {Promise<object>} - The field object matching the ID.
 */
export async function getField(id) {
  return apiRequest(`/field?id=eq.${id}`);
}

/* =============================
 *      Record Functions
 * =============================
 */

/**
 * Function to insert a new record into the database.
 * 
 * @param {object} record - The record data to insert.
 * @returns {Promise<object>} - The created record object returned by the API.
 */
export async function createRecord(record) {
  console.log("Creating record with data:", record);  
  return apiRequest('/record', 'POST', record);
}

/**
 * Function to update an existing record
 * 
 * @param {string} id - The record id to update
 * @returns {Promise<object>} - The updated record object.  
 */
export async function updateRecord(record, id) {
  return apiRequest(`/record?id=eq.${id}`, 'PATCH', record)
}

/**
 * Function to delete an existing record
 * 
 * @param {string} id - The record id to delete
 * @returns {Promise<object>} - Response as a JSON object  
 */
export async function deleteRecord(id) {
  console.log("Deleting record with id:", id);
  return apiRequest(`/record?id=eq.${id}`, 'DELETE')
}

/**
 * Function to list all records associated with the given form id.
 * 
 * @param {string} form_id - The ID of the form to retrieve records from.
 * @returns {Promise<Array>} - An array of field objects.
 */
export async function getRecords(form_id) {
  if (form_id)
    return apiRequest(`/record?form_id=eq.${form_id}`);
  else
    return apiRequest(`/record`);
}

/**
 * Function to list all records associated with the given form id, with given parameter.
 * 
 * @param {string} form_id - The ID of the form to retrieve records from.
 * @param {string} fieldName - The field name to filter location records.
 * @returns {Promise<Array>} - An array of field objects.
 */
export async function getLocationRecords(form_id, fieldName) {
  if (form_id)
    return apiRequest(`/record?form_id=eq.${form_id}&values->${fieldName}->>'latitude'=not.is.null'`);
}

/**
 * Function to get a single record by its ID.
 * 
 * @param {string} id - The ID of the record to retrieve.
 * @returns {Promise<object>} - The record object matching the ID.
 */
export async function getRecord(id) {
  return apiRequest(`/record?id=eq.${id}`);
}