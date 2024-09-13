export interface SwayError {
    component: string
    errorCode: string
    formattedMessage: string
    message: string
    severity: string
    sourceLocation: any[] // You might want to provide a more specific type for sourceLocation
    type: string
}

export interface CompileError {
    details: SwayError[]
}