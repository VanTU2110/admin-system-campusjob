export interface Report { 
    uuid: string;
    reporterUuid: string;
    targetUuid: string;
    targetType: string; 
    reason: string;
    description: string;
    status: string;
    createdAt: string;
}
export interface ListReportResponse {
    data: {
        items: Report[];
        pagination: {
            totalCount: number;
            totalPage: number;
        };
    },
    error: {
        code: string;
        message: string;
    };
}
export interface GetPageReportParams {
    page: number;
    pageSize: number;
    targetType: string;
    targetUuid: string;
}