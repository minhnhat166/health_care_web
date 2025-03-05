import type { Drug } from '@/@types/drug'
import ApiService from './ApiService'

export interface GetDrugsRequest {
    route: string
    id?: string
}

export interface GetDrugsIdResponse {
    ids: string[]
}

export interface GetDrugsNameResponse {
    products: {
        id: string
        tenThuoc: string
    }[]
}

export type ROUTE = 'listId' | 'product-list' | 'thuoc'

export const apiGetDrugs = async (route: ROUTE) => {
    return ApiService.get<GetDrugsIdResponse | GetDrugsNameResponse>(
        `${import.meta.env.VITE_DRUG_URL}/api.php`,
        {
            route: route,
        },
    )
}

export const apiGetDrug = async (route: ROUTE, id: string) => {
    return ApiService.fetchData<Drug>({
        url: `/api.php`,
        method: 'get',
        params: {
            route: route,
            id: id,
        },
    })
}
