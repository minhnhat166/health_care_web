import ApiService from './ApiService'

export const apiPostCreateEmpty = async <T, U extends Record<string, unknown>>(
    data: U,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/medicine-caninet/create-empty`,
        method: 'post',
        data,
    })
}

export const apiPostCreate = async <T, U extends Record<string, unknown>>(
    data: U,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/medicine-caninet/create`,
        method: 'post',
        data,
    })
}

export const apiGetMedicineCaninetUserId = async <
    T,
    U extends Record<string, unknown>,
>(
    userId: string,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/medicine-caninet/${userId}`,
        method: 'get',
    })
}

export const apiPutMedicineCaninetId = async <
    T,
    U extends Record<string, unknown>,
>(
    cabinetId: string,
    data: U,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/medicine-caninet/${cabinetId}`,
        method: 'put',
        params: data,
    })
}

export const apiDeleteMedicineCaninetId = async (cabinetId: string) => {
    return await ApiService.fetchData({
        url: `/api/medicine-caninet/${cabinetId}`,
        method: 'delete',
    })
}

export const apiMedicineCabinetUpdateDrugs = async <
    T,
    U extends Record<string, unknown>,
>(
    cabinetId: string,
    data: U,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/medicine-caninet/${cabinetId}/update-drugs`,
        method: 'put',
        data,
    })
}

export const apiMedicineCabinetDrugs = async <
    T,
    U extends Record<string, unknown>,
>(
    cabinetId: string,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/medicine-caninet/${cabinetId}/drugs`,
        method: 'get',
    })
}
