import { useEffect, useState } from 'react';

interface Data {
    message: string;
    items: string[];
}

export default function ApiTest() {
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/hello/')
            .then(response => response.json())
            .then((json: Data) => {
                setData(json);
            })
            .catch(error => {
                console.error('Erreur lors de la requête API :', error);
            });
    }, []);

    if (!data) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <h1>Test de l'API</h1>
            <p>{data.message}</p>
            <ul>
                {data.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
