import { useState, useEffect } from "react";

const useFetch = (link) => {

    const [data, setData] = useState(null);
    const [pending, setPending] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const abortCont = new AbortController();

        setTimeout(() => {
            fetch(link, { signal: abortCont.signal })
                .then(res => {
                    if (!res.ok) {
                        throw Error("Couldn't Fetch Data");

                    }
                    return res.json();

                })
                .then((data) => {
                    setData(data);
                    setPending(false);
                    // console.log(blogs);
                    setError(null);
                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        console.log('fetch aborted');
                    }
                    else {
                        setError(err.message);
                        setPending(false);
                    }

                })
        }, 1000);

        return () => abortCont.abort();
    }, [link]);
    return { data, pending, error }
}

export default useFetch;