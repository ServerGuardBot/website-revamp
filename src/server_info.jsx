var cache = {}

export async function getServerInfo(id) {
    return new Promise(async function(resolve, reject) {
        const url = `https://www.guilded.gg/api/teams/${id}/info`;

        if (cache[id]) {
            resolve(cache[id]);
        } else {
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject({
                            status: response.status,
                            statusText: response.statusText,
                        });
                    }
                })
                .then((data) => {
                    cache[id] = data;
                    resolve(data);
                });
        }
    });
}