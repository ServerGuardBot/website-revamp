export default class ServerGuardRequest {
    private url: string;
    private method: string;
    private base: string;

    public constructor(url: string, method: string, base?: string) {
        this.url = url;
        this.method = method;
        if (base) {
            this.base = base;
        } else {
            this.base = process.env.NEXT_PUBLIC_API_BASE as string;
        }
    }

    public async execute(body?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let retries = 0;
            const tryRequest = () => {
                fetch(this.base + this.url, {
                    method: this.method,
                    body: typeof body === 'object' ? JSON.stringify(body) : typeof body === 'undefined' ? undefined : body,
                    headers: {
                        'Content-Type': typeof body === 'object' ? 'application/json' : 'text/plain',
                    },
                    credentials: 'include',
                }).then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            resolve(data);
                        }).catch(() => {
                            response.text().then((data) => {
                                resolve(data);
                            });
                        });
                    } else {
                        if (response.status >= 400 && response.status < 500) {
                            // Don't retry client errors
                            reject(response);
                            return
                        }
                        if (retries < 3) {
                            if (response.status === 401) {
                                fetch('/refresh').then((response) => {
                                    if (response.ok) {
                                        retries++;
                                        tryRequest();
                                    } else {
                                        reject(response);
                                        window.location.href = '/login'
                                    }
                                }).catch((response) => {
                                    reject(response);
                                    window.location.href = '/login'
                                })
                            } else {
                                if (response.status >= 500 && response.status < 600) {
                                    setTimeout(() => {
                                        retries++;
                                        tryRequest();
                                    }, retries * 1000);
                                } else {
                                    // Check if there is a rate limit header
                                    const rateLimit = response.headers.get('X-RateLimit-Limit');
                                    if (rateLimit) {
                                        setTimeout(() => {
                                            retries++;
                                            tryRequest();
                                        }, parseInt(rateLimit) * 1000);
                                    } else {
                                        setTimeout(() => {
                                            retries++;
                                            tryRequest();
                                        }, retries * 1000);
                                    }
                                }
                            }
                        } else {
                            reject(response);
                        }
                    }
                }).catch((error: string) => {
                    reject({
                        status: "error",
                        error: error,
                    })
                })
            }

            tryRequest();
        })
    }
}