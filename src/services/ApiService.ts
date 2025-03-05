import BaseService from './BaseService'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },

    get<Response = unknown, Params = Record<string, unknown>>(
        url: string,
        params?: Params,
        config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params'>,
    ): Promise<AxiosResponse<Response>> {
        return this.fetchData<Response>({
            url,
            method: 'GET',
            params,
            ...config,
        })
    },

    post<
        Response = unknown,
        Request extends Record<string, unknown> | undefined = Record<
            string,
            unknown
        >,
    >(
        url: string,
        data?: Request,
        config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>,
    ): Promise<AxiosResponse<Response>> {
        return this.fetchData<Response>({
            url,
            method: 'POST',
            data,
            ...config,
        })
    },

    put<
        Response = unknown,
        Request extends Record<string, unknown> | undefined = Record<
            string,
            unknown
        >,
    >(
        url: string,
        data?: Request,
        config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>,
    ): Promise<AxiosResponse<Response>> {
        return this.fetchData<Response>({
            url,
            method: 'PUT',
            data,
            ...config,
        })
    },

    delete<Response = unknown, Params = Record<string, unknown>>(
        url: string,
        params?: Params,
        config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params'>,
    ): Promise<AxiosResponse<Response>> {
        return this.fetchData<Response>({
            url,
            method: 'DELETE',
            params,
            ...config,
        })
    },
}

export default ApiService
