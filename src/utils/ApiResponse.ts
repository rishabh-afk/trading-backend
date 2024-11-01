export class ApiResponse {
  constructor(
    public success: boolean,
    public data: any,
    public message: string
  ) {}
}
