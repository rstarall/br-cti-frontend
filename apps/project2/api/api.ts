import axios from 'axios';
import { getLocalStorageItem } from '../lib/utils';

/**
 * Create axios instance with default config
 */
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add request interceptor to dynamically set base URL based on the endpoint
 */
api.interceptors.request.use((config) => {
  // Get server hosts from localStorage with defaults
  const clientServerHost = getLocalStorageItem('clientServerHost', 'http://127.0.0.1:5000');
  const blockchainServerHost = getLocalStorageItem('blockchainServerHost', 'http://127.0.0.1:7777');

  // Log the original request URL
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

  // Set base URL based on the endpoint
  if (config.url?.includes('/user/') ||
      config.url?.includes('/client/') ||
      config.url?.includes('/data/')||
      config.url?.includes('/upchain/')||
      config.url?.includes('/model/')||
      config.url?.includes('/blockchain/')
    ) {
    config.baseURL = clientServerHost;
    if(config.url.includes('queryPointTransactions')||
      config.url.includes('queryChain')||
      config.url.includes('queryBlock')||
      config.url.includes('queryUserDetailInfo')||
      config.url.includes('queryUserOwnCTIInfos')
    ) config.baseURL = blockchainServerHost;
  } else if (config.url?.includes('/cti/') || config.url?.includes('/model/') || config.url?.includes('/ipfs/')) {
    config.baseURL = blockchainServerHost;
  } else if (config.url?.includes('/comment/')) {
    // Check if it's a query endpoint (queryCommentsByRefID) which should go to blockchain server
    if (config.url.includes('queryCommentsByRefID')) {
      config.baseURL = blockchainServerHost;
    } else {
      // Other comment endpoints like registerComment go to client server
      config.baseURL = clientServerHost;
    }
  } else if (config.url?.includes('/incentive/')) {
    // Incentive endpoints go to blockchain server
    config.baseURL = blockchainServerHost;
  } else if (config.url?.includes('/kp/') || config.url?.includes('/dataStat/')) {
    // Knowledge Plane and Data Statistics endpoints go to blockchain server
    config.baseURL = blockchainServerHost;
  } else if (config.url?.includes('/ml/')) {
    // ML endpoints go to client server
    config.baseURL = clientServerHost;
  }

  // Log the final request URL with base URL
  console.log(`Final Request URL: ${config.baseURL}${config.url}`);

  return config;
});

/**
 * Add response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`API Response Success: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.status, response.statusText);
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      console.error('Request details:', error.config);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle API errors
    const { status, data, config } = error.response;
    const requestUrl = `${config.baseURL || ''}${config.url}`;

    console.error(`API Error (${status}): ${config.method?.toUpperCase()} ${requestUrl}`, data);

    if (status === 401) {
      return Promise.reject(new Error('Authentication failed. Please login again.'));
    }

    if (status === 403) {
      return Promise.reject(new Error('You do not have permission to access this resource.'));
    }

    if (status === 404) {
      return Promise.reject(new Error(`The requested resource was not found: ${requestUrl}`));
    }

    if (status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // For other errors, return a more detailed message
    const errorMessage = data?.message || error.message || 'Unknown error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
