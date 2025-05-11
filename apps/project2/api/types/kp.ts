// Knowledge Plane API Types

/**
 * IOC geographical distribution data
 * Country code as key, with regions as nested objects
 */
export interface IOCGeoDistribution {
  [countryCode: string]: {
    [region: string]: number;
  };
}

/**
 * Response for IOC geographical distribution query
 */
export interface IOCGeoDistributionResponse {
  result: IOCGeoDistribution;
}

/**
 * IOC type distribution data
 */
export interface IOCTypeDistribution {
  ip_count: number;
  port_count: number;
  payload_count: number;
  url_count: number;
  hash_count: number;
}

/**
 * Response for IOC type distribution query
 */
export interface IOCTypeDistributionResponse {
  result: IOCTypeDistribution;
}

/**
 * Attack type statistics for a specific time period
 */
export interface AttackTypeStats {
  malicious_traffic: number;
  honeypot_info: number;
  botnet: number;
  app_layer_attack: number;
  open_source_info: number;
  total: number;
}

/**
 * Attack type statistics entry with timestamp
 */
export interface AttackTypeStatisticsEntry {
  time: string;
  stats: AttackTypeStats;
}

/**
 * Response for attack type statistics query
 */
export interface AttackTypeStatisticsResponse {
  result: AttackTypeStatisticsEntry[];
}

/**
 * IOC attack information
 */
export interface AttackIOCInfo {
  ip_address: string;
  location: string;
  attack_type: string;
  port: string;
  hash: string;
}

/**
 * Response for attack IOC information query
 */
export interface AttackIOCInfoResponse {
  result: AttackIOCInfo[];
}

/**
 * Traffic type ratio information
 */
export interface TrafficTypeRatio {
  non_traffic_count: number;
  satellite_count: number;
  five_g_count: number;
  sdn_count: number;
}

/**
 * Response for traffic type ratio query
 */
export interface TrafficTypeRatioResponse {
  result: TrafficTypeRatio;
}

/**
 * Traffic time series data entry
 */
export interface TrafficTimeSeriesEntry {
  timestamp: string;
  data: Record<string, number>; // Key is traffic type, value is count
  total: number;
}

/**
 * Response for traffic time series query
 */
export interface TrafficTimeSeriesResponse {
  result: TrafficTimeSeriesEntry[];
}
