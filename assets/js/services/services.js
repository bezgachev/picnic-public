const postData = async (url, data) => {
    const res = await fetch(url, {
        method: 'POST',
        body: data
    });

    return await res.json();
};

export default postData;