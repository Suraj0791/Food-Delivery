interface SuccessResponse {
    success: boolean;
    message: string;
    data: any;
    error: any;
}

export const success: SuccessResponse = {
    success: true,
    message: 'Successfully completed the request',
    data: {},
    error: {}
};