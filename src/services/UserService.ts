import ApiService from './ApiService'

export const apiGetUsers = async <T, U extends Record<string, unknown>>({
    page,
    pageSize,
}: U) => {
    return await ApiService.get<T>(`https://be2.bellybabe.site/api/users/`, {
        page,
        pageSize,
    })
}

export const apiPostUsers = async <T, U extends Record<string, unknown>>(
    data: U,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/users`,
        method: 'post',
        data,
    })
}

export const apiGetUsersId = async <T, U extends Record<string, unknown>>(
    id: string,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/users/${id}`,
        method: 'get',
    })
}

export const apiPutUsersId = async <T, U extends Record<string, unknown>>(
    id: string,
    data: U,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/users/${id}`,
        method: 'put',
        data,
    })
}

export const apiDeleteUsersId = async <T, U extends Record<string, unknown>>(
    id: string,
) => {
    return await ApiService.delete<T>(
        `https://be2.bellybabe.site/api/users/${id}`,
        {},
    )
}

export const apiGetUsersSearch = async <T, U extends Record<string, unknown>>(
    keyword: string,
) => {
    return await ApiService.fetchData<T>({
        url: `/api/users/search`,
        method: 'get',
        params: {
            keyword,
        },
    })
}
