export const postData = async (fetchObject: any) => {
    const { path, postData = {} } = fetchObject
    
    const response = await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    });
    
    return response.json();
}