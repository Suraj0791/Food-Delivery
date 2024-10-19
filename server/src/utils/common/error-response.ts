interface SuccessResponse {
    success: boolean;
    message: string;
    data: any;
    error: any;
}

export const error: SuccessResponse = {
    success: false,
    message: 'Something went wrong',
    data: {},
    error: {}
};