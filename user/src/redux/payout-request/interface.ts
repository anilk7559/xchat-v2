export interface IGetPayoutRequest {
  page: number;
  take: number;
  sort: string;
  sortType: string;
  q: any; // search query
}
