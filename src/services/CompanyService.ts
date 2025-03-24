import ApiService from './ApiService'

export const apiGetCompanyList = async <T>() => {
    return ApiService.get<T>('https://be2.bellybabe.site/api/drugs/companies')
}
