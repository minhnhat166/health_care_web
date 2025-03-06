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

export const apiPostDrugs = async (data: Drug) => {
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
