// IPFS API Types

export interface IPFSFileUrlResponse {
  url: string;
  hash: string;
}

export interface IPFSFileResponse {
  content: string;
  hash: string;
  size: number;
  mime_type?: string;
}

export interface IPFSUploadResponse {
  hash: string;
  size: number;
}
