import type { Drug } from '@/@types/drug'
import ApiService from './ApiService'

export type ApiGetDrugsResponse = {
    totalElement: number
    totalPage: number
    currentPage: number
    pageSize: number
    data: Drug[]
}

export type ApiGetDrugsRequest = {
    page: number
    pageSize: number
}

export const apiGetDrugs = async <T, U extends Record<string, unknown>>({
    page,
    pageSize,
}: U) => {
    return await ApiService.fetchData<T>({
        url: `/api/drugs`,
        method: 'get',
        params: {
            page,
            pageSize,
        },
    })
}

export const apiGetDrugsFilter = async <T, U extends Record<string, unknown>>({
    page,
    pageSize,
    Status,
    Category,
    Group,
}: U) => {
    return await ApiService.fetchData<T>({
        url: `/api/drugs/filter`,
        method: 'get',
        params: {
            page,
            pageSize,
            Status,
            Category,
            Group,
        },
    })
}

export const apiPostDrugs = async (
    data: Omit<Drug, 'drugId' | 'createdAt' | 'updatedAt'>,
) => {
    return await ApiService.fetchData<Drug>({
        url: `/api/drugs`,
        method: 'post',
        data,
    })
}

export const apiGetDrugsId = async (id: string) => {
    return await ApiService.fetchData<Drug>({
        url: `/api/drugs/${id}`,
        method: 'get',
    })
}

export const apiDeleteDrugsId = async (id: string) => {
    return await ApiService.fetchData<Drug>({
        url: `/api/drugs/${id}`,
        method: 'delete',
    })
}

export const apiPutDrugsId = async (id: string, data: Drug) => {
    return await ApiService.fetchData<Drug>({
        url: `/api/drugs/${id}`,
        method: 'put',
        data,
    })
}

export const apiGetDrugsSearchName = async (name: string) => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/name`,
        method: 'get',
        params: {
            name,
        },
    })
}

export const apiGetDrugsSearchIngredient = async (ingredient: string) => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/ingredient`,
        method: 'get',
        params: {
            ingredient,
        },
    })
}

export const apiGetDrugsFilterCompany = async (company: string) => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/company`,
        method: 'get',
        params: {
            company,
        },
    })
}

export const apiGetDrugsFilterCategory = async (category: string) => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/category`,
        method: 'get',
        params: {
            category,
        },
    })
}

export const apiGetDrugsRelatedIngredientId = async (id: string) => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/related/ingredient/${id}`,
        method: 'get',
    })
}

export const apiGetDrugsRelatedCompanyId = async (id: string) => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/related/company`,
        method: 'get',
        params: {
            id,
        },
    })
}

export const apiGetDrugsTopRated = async () => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/top-rated`,
        method: 'get',
    })
}

export const apiGetDrugsTopSearched = async () => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/top-searched`,
        method: 'get',
    })
}

export const apiGetDrugsTopNewRegistered = async () => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/top-new-registered`,
        method: 'get',
    })
}

export const apiGetDrugsTopWithdrawn = async () => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/top-withdrawn`,
        method: 'get',
    })
}

export const apiGetDrugsTopCompanies = async () => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/top-companies`,
        method: 'get',
    })
}

export const apiPostDrugsImageUpload = async <T>(
    drugId: string,
    file: File,
) => {
    const formData = new FormData()
    formData.append('file', file)

    return await ApiService.fetchData<T>({
        url: `/api/drugs/image/${drugId}/upload`,
        method: 'post',
        data: formData as any,
    })
}

export const apiPutDrugsImageUpdate = async <T>(drugId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return await ApiService.fetchData<T>({
        url: `/api/drugs/image/${drugId}/update`,
        method: 'put',
        data: formData as any,
    })
}

export const apiGetDrugsImage = async (drugId: string) => {
    return await ApiService.fetchData<Blob>({
        url: `/api/drugs/${drugId}/image`,
        method: 'get',
    })
}

export const apiDeleteDrugsImage = async (drugId: string) => {
    return await ApiService.fetchData<Blob>({
        url: `/api/drugs/${drugId}/image`,
        method: 'delete',
    })
}

export const apiGetDrugsImages = async (drugId: string) => {
    return await ApiService.fetchData<Blob[]>({
        url: `/api/drugs/${drugId}/images`,
        method: 'get',
    })
}

export const apiPutDrugsPDFUpdate = async <T>(drugId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return await ApiService.fetchData<T>({
        url: `/api/drugs/${drugId}/pdf/update`,
        method: 'put',
        data: formData as any,
    })
}

export const apiPostDrugsPDFUpload = async <T>(drugId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return await ApiService.fetchData<T>({
        url: `/api/drugs/${drugId}/pdf/upload`,
        method: 'post',
        data: formData as any,
    })
}

export const apiGetDrugsPDF = async (drugId: string) => {
    return await ApiService.fetchData<Blob>({
        url: `/api/drugs/${drugId}/pdf`,
        method: 'get',
    })
}

export const apiDeleteDrugsPDF = async (drugId: string) => {
    return await ApiService.fetchData<Blob>({
        url: `/api/drugs/${drugId}/pdf`,
        method: 'delete',
    })
}

export const apiGetDrugsFilterGroup = async (
    group: string,
    page: number,
    pageSize: number,
) => {
    return await ApiService.fetchData<Drug[]>({
        url: `/api/drugs/group`,
        method: 'get',
        params: {
            group,
            page,
            pageSize,
        },
    })
}
