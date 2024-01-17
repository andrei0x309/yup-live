export const reportType = ['post', 'profile']
export type IReportType = typeof reportType[number]
export const reasons = ['spam', 'inappropriate', 'other']
export type IReportReason = typeof reasons[number]
export interface IReport {
    type: IReportType
    reason: IReportReason
    details: string
    resourceId: string
}
